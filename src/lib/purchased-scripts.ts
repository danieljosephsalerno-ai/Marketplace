import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

export interface PurchasedScriptFile {
  id: string
  title: string
  fileName: string
  content: string
}

const cleanFileName = (title: string) =>
  `${title.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').toLowerCase() || 'wedding_script'}.txt`

const textFromScriptRow = (script: any) => {
  const parts = [
    script.title,
    '='.repeat(String(script.title || 'Wedding Script').length),
    '',
    script.author ? `Author: ${script.author}` : null,
    script.category ? `Category: ${script.category}` : null,
    script.language ? `Language: ${script.language}` : null,
    '',
    script.full_description || script.description ? 'Description:' : null,
    script.full_description || script.description || null,
    '',
    '--- SCRIPT CONTENT ---',
    '',
    script.content || script.full_content || script.preview_content || script.previewContent || '',
  ].filter(Boolean)

  return parts.join('\n')
}

export async function getPurchasedScriptsForSession(sessionId: string): Promise<PurchasedScriptFile[]> {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  if (session.payment_status !== 'paid') {
    throw new Error('This checkout session has not been paid yet')
  }

  const scriptIds = JSON.parse(session.metadata?.scriptIds || '[]') as string[]
  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
    expand: ['data.price.product'],
    limit: 100,
  })

  const titleById = new Map<string, string>()
  lineItems.data.forEach((item, index) => {
    const product = item.price?.product
    const metadata = typeof product === 'object' && product && 'metadata' in product ? product.metadata : {}
    const scriptId = metadata?.script_id || scriptIds[index]
    if (scriptId) titleById.set(String(scriptId), item.description || `Wedding Script ${index + 1}`)
  })

  const numericIds = scriptIds.map((id) => Number(id)).filter(Number.isFinite)
  let rows: any[] = []

  if (numericIds.length > 0) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('scripts')
      .select('*')
      .in('id', numericIds)

    rows = data || []
  }

  return scriptIds.map((id, index) => {
    const row = rows.find((script) => String(script.id) === String(id))
    const title = row?.title || titleById.get(String(id)) || `Wedding Script ${index + 1}`
    const content = row
      ? textFromScriptRow(row)
      : `${title}\n${'='.repeat(title.length)}\n\nThank you for your purchase.\n\nThe full script file will be available here once this marketplace listing is connected to its uploaded script content.`

    return {
      id: String(id),
      title,
      fileName: cleanFileName(title),
      content,
    }
  })
}
