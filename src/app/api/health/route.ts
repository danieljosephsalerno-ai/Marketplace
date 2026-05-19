import { NextResponse } from 'next/server'

export async function GET() {
  const config = {
    stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
    stripeKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 12) || 'NOT_SET',
    supabaseConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(config)
}
