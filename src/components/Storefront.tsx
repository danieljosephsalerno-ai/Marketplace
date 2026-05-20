'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ExternalLink, FileText, Loader2, ShoppingCart, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CartSidebar } from '@/components/CartSidebar'
import { LEGAL_POLICY_LINKS } from '@/lib/legal-policies'

type StoreScript = {
  id: number
  title: string
  type: string | null
  price: number | null
  rating: number | null
  sales_count: number | null
  description: string | null
  marketplace_languages: string[] | null
  marketplace_categories: string[] | null
  marketplace_ceremony_types: string[] | null
  marketplace_visibility: string | null
}

export function Storefront() {
  const params = useParams<{ sellerId: string }>()
  const sellerId = params.sellerId
  const supabase = createClient()
  const { addToCart, getCartCount, setIsOpen } = useCart()
  const [scripts, setScripts] = useState<StoreScript[]>([])
  const [sellerName, setSellerName] = useState('Officiant Store')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadStore() {
      setIsLoading(true)
      setError('')

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, first_name, last_name, business_name')
        .eq('user_id', sellerId)
        .maybeSingle()

      if (profile) {
        const fullName = profile.full_name || [profile.first_name, profile.last_name].filter(Boolean).join(' ')
        setSellerName(profile.business_name || fullName || 'Officiant Store')
      }

      const { data, error: scriptsError } = await supabase
        .from('scripts')
        .select('id,title,type,price,rating,sales_count,description,marketplace_languages,marketplace_categories,marketplace_ceremony_types,marketplace_visibility')
        .eq('user_id', sellerId)
        .eq('is_published', true)
        .neq('marketplace_visibility', 'private')
        .order('marketplace_published_at', { ascending: false })

      if (scriptsError) {
        setError(scriptsError.message)
        setScripts([])
      } else {
        setScripts(data || [])
      }

      setIsLoading(false)
    }

    if (sellerId) loadStore()
  }, [sellerId])

  const handleAddToCart = (script: StoreScript) => {
    const categories = script.marketplace_categories || []
    const ceremonyTypes = script.marketplace_ceremony_types || []
    const languages = script.marketplace_languages || []

    addToCart({
      id: script.id,
      title: script.title,
      price: Number(script.price || 0),
      language: languages[0] || 'English',
      author: sellerName,
      category: categories[0] || 'Wedding',
      type: ceremonyTypes[0] || script.type || 'Wedding',
    })
    setIsOpen(true)
  }

  return (
    <main className="min-h-screen bg-blue-50">
      <header className="border-b border-blue-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-700">
              Script Marketplace
            </Link>
            <h1 className="mt-1 text-2xl font-bold text-gray-950">{sellerName}</h1>
            <p className="text-sm text-gray-600">Wedding scripts from this seller's personal store</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/">
                Main Marketplace
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button onClick={() => setIsOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart {getCartCount() > 0 ? `(${getCartCount()})` : ''}
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        {isLoading ? (
          <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-white p-5 text-blue-700">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading store...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">{error}</div>
        ) : scripts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-blue-200 bg-white p-10 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-blue-300" />
            <p className="font-semibold text-gray-900">No scripts are available in this store yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {scripts.map((script) => {
              const categories = script.marketplace_categories || []
              const ceremonyTypes = script.marketplace_ceremony_types || []
              const languages = script.marketplace_languages || []

              return (
                <Card key={script.id} className="border-blue-100 bg-white shadow-sm">
                  <CardHeader>
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                        <FileText className="h-5 w-5" />
                      </div>
                      <Badge variant="outline">
                        {script.marketplace_visibility === 'main_marketplace' ? 'Featured' : 'Store'}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-snug">{script.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="line-clamp-3 text-sm text-gray-600">{script.description || 'Wedding ceremony script'}</p>
                    <div className="flex flex-wrap gap-2">
                      {[...categories, ...ceremonyTypes, ...languages].slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{Number(script.rating || 0).toFixed(1)}</span>
                      <span>•</span>
                      <span>{script.sales_count || 0} sales</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-2xl font-bold text-gray-950">${Number(script.price || 0).toFixed(2)}</p>
                      <Button onClick={() => handleAddToCart(script)} className="bg-blue-600 hover:bg-blue-700">
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      <footer className="border-t border-blue-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-5 gap-y-2 px-6 py-5 text-sm text-gray-600">
          {LEGAL_POLICY_LINKS.map((link) => (
            <Link key={link.slug} href={link.href} className="hover:text-blue-700 hover:underline">
              {link.title}
            </Link>
          ))}
        </div>
      </footer>

      <CartSidebar language="en" />
    </main>
  )
}
