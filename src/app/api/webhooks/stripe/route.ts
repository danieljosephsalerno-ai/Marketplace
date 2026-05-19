import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Lazy initialize Stripe to avoid build-time errors when API key is not available
let stripe: Stripe | null = null
function getStripe() {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured')
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  }
  return stripe
}

// Use service role key for webhook operations (server-side only)
function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not configured')
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  // If webhook secret is configured, verify signature
  if (process.env.STRIPE_WEBHOOK_SECRET && signature) {
    try {
      const event = getStripe().webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
      return handleStripeEvent(event)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
    }
  }

  // For development without webhook signature verification
  try {
    const event = JSON.parse(body) as Stripe.Event
    return handleStripeEvent(event)
  } catch (err) {
    console.error('Failed to parse webhook body:', err)
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

async function handleStripeEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      await handleSuccessfulPayment(session)
      break
    }

    case 'payment_intent.succeeded': {
      console.log('Payment intent succeeded:', event.data.object)
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const scriptIdsJson = session.metadata?.scriptIds

  if (!userId || !scriptIdsJson) {
    console.error('Missing metadata in checkout session')
    return
  }

  try {
    const supabase = getSupabase()
    const scriptIds = JSON.parse(scriptIdsJson) as string[]
    const amountTotal = session.amount_total ? session.amount_total / 100 : 0

    // Record each purchase in the database
    for (const scriptId of scriptIds) {
      const { error } = await supabase.from('purchases').insert({
        user_id: userId,
        script_id: scriptId,
        amount_paid: amountTotal / scriptIds.length, // Split evenly for now
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent as string,
        status: 'completed',
      })

      if (error) {
        console.error('Failed to record purchase:', error)
      }
    }

    console.log(`Successfully recorded ${scriptIds.length} purchases for user ${userId}`)
  } catch (err) {
    console.error('Error processing successful payment:', err)
  }
}
