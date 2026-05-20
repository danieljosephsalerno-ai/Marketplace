'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Download, ExternalLink, FileText, Loader2, LogIn } from 'lucide-react'
import { AuthDialog } from '@/components/AuthDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'

interface PurchasedScriptFile {
  id: string
  title: string
  fileName: string
  content: string
}

function PurchaseSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id') || ''
  const { isAuthenticated } = useAuth()
  const [scripts, setScripts] = useState<PurchasedScriptFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [pendingPortalSave, setPendingPortalSave] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const portalUrl = useMemo(() => {
    return process.env.NEXT_PUBLIC_OFFICIANT_PORTAL_URL || 'https://portal.ordainedpro.com'
  }, [])

  useEffect(() => {
    if (!sessionId) {
      setError('Missing checkout session. Please contact support if your payment completed.')
      setIsLoading(false)
      return
    }

    try {
      localStorage.removeItem('scriptCart')
    } catch {
      // Storage can be unavailable in private browsing; the purchase flow still works.
    }

    async function loadPurchasedScripts() {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch(`/api/purchase-session?session_id=${encodeURIComponent(sessionId)}`)
        const data = await response.json()

        if (!response.ok) throw new Error(data.error || 'Unable to load your purchased scripts')

        setScripts(data.scripts || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load your purchased scripts')
      } finally {
        setIsLoading(false)
      }
    }

    loadPurchasedScripts()
  }, [sessionId])

  useEffect(() => {
    if (isAuthenticated && pendingPortalSave) {
      setPendingPortalSave(false)
      addToPortal()
    }
  }, [isAuthenticated, pendingPortalSave])

  const downloadScript = (script: PurchasedScriptFile) => {
    const blob = new Blob([script.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = script.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const downloadAll = () => {
    scripts.forEach((script) => downloadScript(script))
  }

  const addToPortal = async () => {
    if (!isAuthenticated) {
      setPendingPortalSave(true)
      setAuthOpen(true)
      return
    }

    setIsSaving(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/api/add-to-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Unable to save scripts to your portal')

      setMessage('Saved to your officiant portal documents. You can now attach the script to an active couple from the Documents section.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save scripts to your portal')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-blue-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Card className="border-blue-200 shadow-sm">
          <CardHeader>
            <Badge className="mb-3 w-fit bg-green-100 text-green-800 hover:bg-green-100">Purchase Complete</Badge>
            <CardTitle className="text-3xl">Your wedding script is ready</CardTitle>
            <CardDescription>
              Choose whether to save it to your officiant portal for later use or download it now.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-white p-4 text-blue-700">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading your purchased script...
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
            ) : (
              <>
                <div className="grid gap-3">
                  {scripts.map((script) => (
                    <div key={script.id} className="flex items-center justify-between rounded-lg border border-blue-100 bg-white p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{script.title}</p>
                          <p className="text-sm text-gray-500">Plain text script document</p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => downloadScript(script)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button className="h-12 bg-blue-600 hover:bg-blue-700" onClick={addToPortal} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                    Add wedding script to my officiant portal
                  </Button>
                  <Button className="h-12" variant="outline" onClick={downloadAll}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>

                {message && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                    {message}
                    <div className="mt-3">
                      <Button asChild size="sm" variant="outline">
                        <Link href={portalUrl}>
                          Open officiant portal
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} language="en" />
    </main>
  )
}

export default function PurchaseSuccessPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-blue-50 px-6 py-10" />}>
      <PurchaseSuccessContent />
    </Suspense>
  )
}
