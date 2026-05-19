'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { Download, ArrowLeft, Heart, ShoppingCart, Star, Lock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScriptAuthor } from '@/components/ScriptAuthor'

// Script data (same as marketplace)
const scripts = [
  {
    id: 1,
    title: "Classic Traditional Wedding Ceremony",
    description: "A timeless script perfect for traditional Christian weddings with beautiful, meaningful vows.",
    fullDescription: "This comprehensive wedding ceremony script has been carefully crafted to honor traditional Christian values while creating a warm, memorable experience for all attendees. The script includes customizable vows, readings, and blessings that can be adapted to your specific denomination and preferences.",
    price: 29.99,
    rating: 4.8,
    reviews: 127,
    category: "Christian",
    type: "Wedding",
    language: "English",
    author: "Rev. Sarah Johnson",
    tags: ["Traditional", "Christian", "Formal"],
    downloadUrl: "/scripts/classic-traditional-wedding.pdf",
    previewContent: "Opening Words:\n\nDearly beloved, we are gathered here today in the sight of God and in the presence of family and friends to join together this man and this woman in holy matrimony...\n\n[Full script content would appear here for purchased users]"
  },
  {
    id: 2,
    title: "Ceremonia de Boda Católica Tradicional",
    description: "Script tradicional en español para bodas católicas con lecturas bíblicas y bendiciones.",
    fullDescription: "Este guión completo de ceremonia de boda católica incluye todas las lecturas, bendiciones y rituales tradicionales. Perfecto para parejas que desean una ceremonia auténtica en español.",
    price: 34.99,
    rating: 4.9,
    reviews: 89,
    category: "Catholic",
    type: "Wedding",
    language: "Spanish",
    author: "Padre Miguel Rodriguez",
    tags: ["Católica", "Tradicional", "Español"],
    downloadUrl: "/scripts/ceremonia-catolica.pdf",
    previewContent: "Palabras de Apertura:\n\nQueridos hermanos, nos hemos reunido aquí hoy ante Dios y en presencia de la familia y amigos para unir a este hombre y esta mujer en santo matrimonio..."
  },
  {
    id: 3,
    title: "Modern Secular Wedding Script",
    description: "Contemporary non-religious ceremony script focusing on love, commitment, and personal vows.",
    fullDescription: "A beautifully crafted non-religious ceremony script that celebrates love, partnership, and commitment. This modern script emphasizes personal storytelling and meaningful moments without religious references.",
    price: 24.99,
    rating: 4.7,
    reviews: 203,
    category: "Secular",
    type: "Wedding",
    language: "English",
    author: "Jennifer Park",
    tags: ["Modern", "Secular", "Personal"],
    downloadUrl: "/scripts/modern-secular-wedding.pdf",
    previewContent: "Welcome:\n\nWelcome, everyone. We are gathered here today to celebrate the love and commitment between [Partner 1] and [Partner 2]..."
  },
  {
    id: 4,
    title: "Quinceañera Celebration Script",
    description: "Beautiful coming-of-age ceremony script with traditional blessings and modern touches.",
    fullDescription: "This quinceañera script honors tradition while incorporating modern elements that resonate with today's young women. Includes blessings, symbolic ceremonies, and bilingual options.",
    price: 19.99,
    rating: 4.6,
    reviews: 76,
    category: "Cultural",
    type: "Quinceañera",
    language: "Spanish",
    author: "Maria Elena Gonzalez",
    tags: ["Quinceañera", "Cultural", "Bilingual"],
    downloadUrl: "/scripts/quinceanera-celebration.pdf",
    previewContent: "Bienvenida:\n\nBuenas tardes familia y amigos. Hoy celebramos un momento muy especial en la vida de nuestra querida quinceañera..."
  },
  {
    id: 5,
    title: "Celebration of Life Memorial",
    description: "Uplifting memorial service script that celebrates a life well-lived with dignity and hope.",
    fullDescription: "This memorial service script focuses on celebrating the life and legacy of the departed with warmth, dignity, and hope. Includes readings, reflections, and customizable sections.",
    price: 22.99,
    rating: 4.9,
    reviews: 145,
    category: "Memorial",
    type: "Celebration of Life",
    language: "English",
    author: "Dr. Robert Chen",
    tags: ["Memorial", "Uplifting", "Celebration"],
    downloadUrl: "/scripts/celebration-of-life.pdf",
    previewContent: "Opening:\n\nWe gather today to celebrate the remarkable life of [Name], to honor their memory, and to find comfort in the legacy they leave behind..."
  },
  {
    id: 6,
    title: "Jewish Wedding Ceremony",
    description: "Traditional Jewish wedding script with chuppah ceremony, ring exchange, and breaking of glass.",
    fullDescription: "A complete Jewish wedding ceremony script incorporating all traditional elements including the chuppah ceremony, ketubah reading, seven blessings, and breaking of the glass.",
    price: 39.99,
    rating: 4.8,
    reviews: 94,
    category: "Jewish",
    type: "Wedding",
    language: "English",
    author: "Rabbi David Goldstein",
    tags: ["Jewish", "Traditional", "Chuppah"],
    downloadUrl: "/scripts/jewish-wedding.pdf",
    previewContent: "Processional and Welcoming:\n\nBaruch haba b'shem Adonai - Blessed are you who come in the name of the Lord. We welcome you under the chuppah..."
  }
]

export default function ScriptDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isAuthenticated, toggleFavorite, isFavorited, isPurchased } = useAuth()
  const { addToCart } = useCart()
  const [mounted, setMounted] = useState(false)

  const scriptId = parseInt(params.id as string)
  const script = scripts.find(s => s.id === scriptId)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (!script) {
    return (
      <div className="min-h-screen background-gradient flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Script not found</h1>
          <Button onClick={() => router.push('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        </div>
      </div>
    )
  }

  const purchased = isPurchased(script.id)
  const favorited = isFavorited(script.id)

  const handleDownload = async () => {
    try {
      // Use the secure download API endpoint
      const response = await fetch(`/api/download/${script.id}`)

      if (!response.ok) {
        const error = await response.json()
        alert(`Download failed: ${error.error}`)
        return
      }

      // Create a blob from the response and trigger download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${script.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
      alert('Download failed. Please try again.')
    }
  }

  const handleAddToCart = () => {
    addToCart({
      id: script.id,
      title: script.title,
      price: script.price,
      language: script.language,
      author: script.author,
      category: script.category,
      type: script.type
    })
  }

  return (
    <div className="min-h-screen background-gradient">
      <div className="bg-white border-b border-light shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Button variant="outline" onClick={() => router.push('/')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-3">{script.title}</CardTitle>
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <Badge variant="secondary">{script.category}</Badge>
                      <Badge className="success">{script.language}</Badge>
                      {script.type === 'LGBTQ' && (
                        <Badge className="lgbtq">
                          🏳️‍🌈 LGBTQ+
                        </Badge>
                      )}
                      {purchased && (
                        <Badge className="success">
                          ✓ Purchased
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(script.id)}
                    className={`${favorited ? 'professional-writer' : 'text-gray-400 hover:text-red-500'} transition-colors`}
                  >
                    <Heart className={`h-5 w-5 ${favorited ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span className="text-xs">by</span>
                  <ScriptAuthor authorName={script.author} size="md" showName={true} />
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-lg">{script.rating}</span>
                    <span className="text-gray-500">({script.reviews} reviews)</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {script.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="pt-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{script.fullDescription}</p>
                </div>

                <Separator className="my-6" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Script Preview</h3>
                    {!purchased && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Purchase to unlock full script
                      </Badge>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed">
                      {purchased ? script.previewContent : script.previewContent.substring(0, 150) + '...\n\n[Purchase this script to view the full content]'}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-900">
                  ${script.price}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {purchased ? (
                  <>
                    <Button
                      onClick={handleDownload}
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Script
                    </Button>
                    <Button
                      onClick={() => router.push('/library')}
                      variant="outline"
                      className="w-full"
                    >
                      View in Library
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleAddToCart}
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      Instant download after purchase
                    </p>
                  </>
                )}

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Format:</span>
                    <span className="font-medium">PDF</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language:</span>
                    <span className="font-medium">{script.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{script.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{script.type}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
