import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const scriptId = parseInt(id)

    if (isNaN(scriptId)) {
      return NextResponse.json(
        { error: 'Invalid script ID' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in to download scripts' },
        { status: 401 }
      )
    }

    // Check if user has purchased this script
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', user.id)
      .eq('script_id', scriptId)
      .single()

    if (purchaseError || !purchase) {
      return NextResponse.json(
        { error: 'You have not purchased this script' },
        { status: 403 }
      )
    }

    // Get script details
    const { data: script, error: scriptError } = await supabase
      .from('scripts')
      .select('*')
      .eq('id', scriptId)
      .single()

    if (scriptError || !script) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      )
    }

    // In a real implementation, you would:
    // 1. Fetch the actual file from Supabase Storage or S3
    // 2. Return the file as a downloadable response
    // For now, we'll return the script content as a PDF-like response

    const scriptContent = `
${script.title}
${'='.repeat(script.title.length)}

Author: ${script.author}
Category: ${script.category}
Language: ${script.language}

Description:
${script.full_description || script.description}

--- SCRIPT CONTENT ---

${script.preview_content}

[This is a demo. In production, the full script content would be here.]
    `.trim()

    // Return as downloadable text file
    return new NextResponse(scriptContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${script.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt"`,
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
