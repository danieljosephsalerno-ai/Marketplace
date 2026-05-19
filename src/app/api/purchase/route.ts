import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in to make purchases' },
        { status: 401 }
      )
    }

    // Get script IDs from request body
    const { scriptIds } = await request.json()

    if (!Array.isArray(scriptIds) || scriptIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid script IDs' },
        { status: 400 }
      )
    }

    // In a real implementation, you would:
    // 1. Process payment with Stripe/PayPal
    // 2. Only create purchase records after successful payment
    // For now, we'll simulate successful payment and create the purchases

    const purchasePromises = scriptIds.map(async (scriptId) => {
      // Use upsert to avoid duplicate purchase errors
      const { data, error } = await supabase
        .from('purchases')
        .upsert(
          {
            user_id: user.id,
            script_id: scriptId,
          },
          {
            onConflict: 'user_id,script_id',
            ignoreDuplicates: true,
          }
        )
        .select()

      return { scriptId, success: !error, error }
    })

    const results = await Promise.all(purchasePromises)
    const successfulPurchases = results.filter(r => r.success).map(r => r.scriptId)
    const failedPurchases = results.filter(r => !r.success)

    return NextResponse.json({
      success: true,
      purchasedScriptIds: successfulPurchases,
      message: `Successfully purchased ${successfulPurchases.length} script(s)`,
      failures: failedPurchases.length > 0 ? failedPurchases : undefined,
    })
  } catch (error) {
    console.error('Purchase error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
