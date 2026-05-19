'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Download, Eye, Heart, ArrowLeft, FileText } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScriptAuthor } from '@/components/ScriptAuthor'

// Script data (same as marketplace)
const scripts = [
  {
    id: 1,
    title: "Classic Traditional Wedding Ceremony",
    description: "A timeless script perfect for traditional Christian weddings with beautiful, meaningful vows.",
    price: 29.99,
    rating: 4.8,
    reviews: 127,
    category: "Christian",
    type: "Wedding",
    language: "English",
    author: "Rev. Sarah Johnson",
    tags: ["Traditional", "Christian", "Formal"],
    downloadUrl: "/scripts/classic-traditional-wedding.pdf"
  },
  {
    id: 2,
    title: "Ceremonia de Boda Católica Tradicional",
    description: "Script tradicional en español para bodas católicas con lecturas bíblicas y bendiciones.",
    price: 34.99,
    rating: 4.9,
    reviews: 89,
    category: "Catholic",
    type: "Wedding",
    language: "Spanish",
    author: "Padre Miguel Rodriguez",
    tags: ["Católica", "Tradicional", "Español"],
    downloadUrl: "/scripts/ceremonia-catolica.pdf"
  },
  {
    id: 3,
    title: "Modern Secular Wedding Script",
    description: "Contemporary non-religious ceremony script focusing on love, commitment, and personal vows.",
    price: 24.99,
    rating: 4.7,
    reviews: 203,
    category: "Secular",
    type: "Wedding",
    language: "English",
    author: "Jennifer Park",
    tags: ["Modern", "Secular", "Personal"],
    downloadUrl: "/scripts/modern-secular-wedding.pdf"
  },
  {
    id: 4,
    title: "Quinceañera Celebration Script",
    description: "Beautiful coming-of-age ceremony script with traditional blessings and modern touches.",
    price: 19.99,
    rating: 4.6,
    reviews: 76,
    category: "Cultural",
    type: "Quinceañera",
    language: "Spanish",
    author: "Maria Elena Gonzalez",
    tags: ["Quinceañera", "Cultural", "Bilingual"],
    downloadUrl: "/scripts/quinceanera-celebration.pdf"
  },
  {
    id: 5,
    title: "Celebration of Life Memorial",
    description: "Uplifting memorial service script that celebrates a life well-lived with dignity and hope.",
    price: 22.99,
    rating: 4.9,
    reviews: 145,
    category: "Memorial",
    type: "Celebration of Life",
    language: "English",
    author: "Dr. Robert Chen",
    tags: ["Memorial", "Uplifting", "Celebration"],
    downloadUrl: "/scripts/celebration-of-life.pdf"
  },
  {
    id: 6,
    title: "Jewish Wedding Ceremony",
    description: "Traditional Jewish wedding script with chuppah ceremony, ring exchange, and breaking of glass.",
    price: 39.99,
    rating: 4.8,
    reviews: 94,
    category: "Jewish",
    type: "Wedding",
    language: "English",
    author: "Rabbi David Goldstein",
    tags: ["Jewish", "Traditional", "Chuppah"],
    downloadUrl: "/scripts/jewish-wedding.pdf"
  }
]

export default function LibraryPage() {
  const router = useRouter()
  const { user, isAuthenticated, isFavorited } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [currentTab, setCurrentTab] = useState('purchased')

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  if (!mounted || !user) {
    return null
  }

  const purchasedScripts = scripts.filter(script => user.purchasedScripts.includes(script.id))
  const favoriteScripts = scripts.filter(script => user.favoriteScripts.includes(script.id))

  const handleDownload = async (scriptId: number, title: string, downloadUrl: string) => {
    try {
      // Use the secure download API endpoint
      const response = await fetch(`/api/download/${scriptId}`)

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
      a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
      alert('Download failed. Please try again.')
    }
  }

  const t = {
    library: 'My Library',
    purchased: 'Purchased Scripts',
    favorites: 'Favorites',
    backToMarketplace: 'Back to Marketplace',
    noPurchased: 'You haven\'t purchased any scripts yet.',
    noFavorites: 'You don\'t have any favorites yet.',
    browseScripts: 'Browse Scripts',
    download: 'Download',
    preview: 'Preview',
    by: 'by',
    scripts: 'scripts'
  }

  return (
    <div className="min-h-screen background-gradient">
      <div className="bg-white border-b border-light shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t.library}</h1>
              <p className="text-gray-600 mt-1">View and download your purchased scripts</p>
            </div>
            <Button variant="outline" onClick={() => router.push('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.backToMarketplace}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="purchased" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t.purchased} ({purchasedScripts.length})
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              {t.favorites} ({favoriteScripts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="purchased">
            {purchasedScripts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">{t.noPurchased}</p>
                <Button onClick={() => router.push('/')}>
                  {t.browseScripts}
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchasedScripts.map((script) => (
                  <Card key={script.id} className="group hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2">
                            {script.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge variant="secondary" className="text-xs">
                              {script.category}
                            </Badge>
                            <Badge className="success text-xs">
                              {script.language}
                            </Badge>
                            {script.type === 'LGBTQ' && (
                              <Badge className="lgbtq text-xs">
                                🏳️‍🌈 LGBTQ+
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Badge className="success text-xs">
                          ✓ Owned
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {script.description}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <span className="text-xs">{t.by}</span>
                        <ScriptAuthor authorName={script.author} size="sm" showName={true} />
                      </div>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {script.tags.slice(0, 3).map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="flex gap-2">
                      <Button
                        onClick={() => router.push(`/script/${script.id}`)}
                        variant="outline"
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {t.preview}
                      </Button>
                      <Button
                        onClick={() => handleDownload(script.id, script.title, script.downloadUrl)}
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {t.download}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites">
            {favoriteScripts.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">{t.noFavorites}</p>
                <Button onClick={() => router.push('/')}>
                  {t.browseScripts}
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteScripts.map((script) => (
                  <Card key={script.id} className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => router.push(`/script/${script.id}`)}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                            {script.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge variant="secondary" className="text-xs">
                              {script.category}
                            </Badge>
                            <Badge className="success text-xs">
                              {script.language}
                            </Badge>
                            {user.purchasedScripts.includes(script.id) && (
                              <Badge className="success text-xs">
                                ✓ Owned
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {script.description}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <span className="text-xs">{t.by}</span>
                        <ScriptAuthor authorName={script.author} size="sm" showName={true} />
                      </div>
                    </CardContent>

                    <CardFooter>
                      <div className="text-2xl font-bold text-gray-900">
                        ${script.price}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
