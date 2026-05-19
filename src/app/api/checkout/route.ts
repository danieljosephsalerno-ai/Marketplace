import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  author?: {
    name: string
    stripeConnectId?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe secret key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured')
      return NextResponse.json(
        { error: 'Payment system not configured. Please contact support.' },
        { status: 500 }
      )
    }

    // Initialize Stripe with the secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const { items, userId } = await request.json() as { items: CartItem[], userId: string }

    console.log('Checkout request received:', { itemCount: items?.length, userId })

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    // Create line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          metadata: {
            script_id: item.id,
          },
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Get the origin from the request
    const origin = request.headers.get('origin') || 'https://scripts.ordainedpro.com'
    console.log('Using origin for redirect:', origin)

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}?purchase=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}?purchase=cancelled`,
      metadata: {
        userId: userId,
        scriptIds: JSON.stringify(items.map(item => item.id)),
      },
    })

    console.log('Stripe session created:', { sessionId: session.id, url: session.url })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to generate checkout URL' },
        { status: 500 }
      )
    }

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)

    // Provide more detailed error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const isStripeError = error instanceof Stripe.errors.StripeError

    return NextResponse.json(
      {
        error: isStripeError
          ? `Payment error: ${errorMessage}`
          : `Checkout failed: ${errorMessage}`
      },
      { status: 500 }
    )
  }
}
