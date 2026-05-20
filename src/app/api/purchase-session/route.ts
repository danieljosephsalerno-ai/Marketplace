import { NextRequest, NextResponse } from 'next/server'
import { getPurchasedScriptsForSession } from '@/lib/purchased-scripts'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing checkout session ID' }, { status: 400 })
    }

    const scripts = await getPurchasedScriptsForSession(sessionId)
    return NextResponse.json({ scripts })
  } catch (error) {
    console.error('Purchase session lookup error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load purchased scripts' },
      { status: 500 }
    )
  }
}
