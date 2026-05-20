import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPurchasedScriptsForSession } from '@/lib/purchased-scripts'

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json() as { sessionId?: string }

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing checkout session ID' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Please log in or sign up before adding scripts to your portal.' }, { status: 401 })
    }

    const scripts = await getPurchasedScriptsForSession(sessionId)
    const saved: Array<{ id: string; title: string }> = []

    for (const script of scripts) {
      const fileBlob = new Blob([script.content], { type: 'text/plain' })
      const storagePath = `${user.id}/marketplace/${Date.now()}-${script.fileName}`

      const { error: uploadError } = await supabase.storage
        .from('user-documents')
        .upload(storagePath, fileBlob, { upsert: true, contentType: 'text/plain' })

      if (uploadError) {
        throw new Error(`Storage upload failed for ${script.title}: ${uploadError.message}`)
      }

      const { data: urlData } = supabase.storage
        .from('user-documents')
        .getPublicUrl(storagePath)

      const { data, error: insertError } = await supabase
        .from('user_files')
        .insert({
          user_id: user.id,
          name: script.title,
          type: 'text/plain',
          size: fileBlob.size,
          url: urlData.publicUrl,
          created_at: new Date().toISOString(),
        })
        .select('id, name')
        .single()

      if (insertError) {
        throw new Error(`Document save failed for ${script.title}: ${insertError.message}`)
      }

      saved.push({ id: String(data.id), title: data.name })
    }

    return NextResponse.json({ success: true, saved })
  } catch (error) {
    console.error('Add purchased script to portal error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to add script to portal' },
      { status: 500 }
    )
  }
}
