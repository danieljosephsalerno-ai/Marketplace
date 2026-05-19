'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { CheckoutHandler } from '@/components/CheckoutHandler'
import { Search, Filter, Star, Heart, User, Globe, ShoppingCart, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CartProvider, useCart } from '@/contexts/CartContext'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { CartSidebar } from '@/components/CartSidebar'
import { UserProfile } from '@/components/UserProfile'
import { ScriptAuthor } from '@/components/ScriptAuthor'
import { UserShowcase } from '@/components/UserShowcase'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

// TypeScript interfaces
interface Script {
  id: number
  title: string
  description: string
  price: number
  rating: number
  reviews: number
  category: string
  type: string
  language: string
  author: string
  tags: string[]
  isFavorite: boolean
  isPopular: boolean
  previewContent: string
}

interface Translations {
  title: string
  subtitle: string
  search: string
  categories: string
  ceremonies: string
  popular: string
  results: string
  sortBy: string
  popular_sort: string
  price_low: string
  price_high: string
  rating: string
  by: string
  reviews: string
  addToCart: string
  favorites: string
  allScripts: string
  priceRange: string
  minRating: string
  clearFilters: string
  noFavorites: string
  addToFavorites: string
  removeFromFavorites: string
}

// Sample script data
const scripts: Script[] = [
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
    isFavorite: false,
    isPopular: true,
    previewContent: `Opening Words:

Dearly beloved, we are gathered here today in the sight of God and in the presence of family and friends to join together this man and this woman in holy matrimony, which is an honorable estate, instituted by God, and signifying the mystical union between Christ and His Church.

Declaration of Intent:

[Partner 1], do you take [Partner 2] to be your lawfully wedded wife/husband, to have and to hold from this day forward, for better, for worse, for richer, for poorer, in sickness and in health, to love and to cherish till death do you part?

Exchange of Vows:

I, [Partner 1], take you, [Partner 2], to be my wedded wife/husband, to have and to hold from this day forward, for better, for worse, for richer, for poorer, in sickness and in health, to love and to cherish, till death us do part, according to God's holy ordinance.

Ring Exchange:

This ring is a symbol of my love and faithfulness. As I place it on your finger, I commit my heart and soul to you.

Blessing:

May the Lord bless you and keep you. May the Lord make His face shine upon you and be gracious to you. May the Lord turn His face toward you and give you peace.`
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
    isFavorite: false,
    isPopular: true,
    previewContent: `Palabras de Apertura:

Queridos hermanos, nos hemos reunido aquí hoy ante Dios y en presencia de la familia y amigos para unir a este hombre y esta mujer en santo matrimonio, que es un sacramento instituido por Dios.

Lecturas Bíblicas:

"El amor es paciente, es bondadoso. El amor no es envidioso ni jactancioso ni orgulloso. No se comporta con rudeza, no es egoísta, no se enoja fácilmente, no guarda rencor." - 1 Corintios 13:4-5

Intercambio de Consentimiento:

[Pareja 1], ¿aceptas a [Pareja 2] como tu esposa/esposo y prometes serle fiel en la prosperidad y en la adversidad, en la salud y en la enfermedad, y así amarla y respetarla todos los días de tu vida?

Intercambio de Anillos:

Este anillo es símbolo de mi amor y fidelidad. Al colocarlo en tu dedo, te entrego mi corazón y mi vida.

Bendición Final:

Que Dios Todopoderoso los bendiga: El Padre, el Hijo y el Espíritu Santo. Amén.`
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
    isFavorite: true,
    isPopular: true,
    previewContent: `Welcome:

Welcome, everyone. We are gathered here today to celebrate the love and commitment between [Partner 1] and [Partner 2]. This is a day of great joy, as two people who have chosen to walk through life together make that commitment official.

Reading on Love:

"Love is friendship that has caught fire. It is quiet understanding, mutual confidence, sharing and forgiving. It is loyalty through good and bad times."

Personal Vows:

[Partner 1], please share your vows with [Partner 2].

[Partner 2], please share your vows with [Partner 1].

Ring Exchange:

These rings are a symbol of the unbroken circle of love. As you wear these rings, may they remind you of the promises you make here today.

Pronouncement:

By the power vested in me, I now pronounce you married partners for life. You may seal your commitment with a kiss!`
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
    isFavorite: false,
    isPopular: false,
    previewContent: `Bienvenida:

Buenas tardes familia y amigos. Hoy celebramos un momento muy especial en la vida de nuestra querida quinceañera. Este día marca su transición de niña a mujer joven.

Ceremonia de la Corona:

Esta corona simboliza la responsabilidad y el honor que vienes con la madurez. Que siempre recuerdes que eres hija de Dios.

Ceremonia del Último Muñeco:

Este muñeco representa tu niñez. Al dejarlo, abrazas las responsabilidades de ser una joven mujer.

Bendición:

Que Dios te bendiga en este nuevo camino. Que siempre camines con fe, esperanza y amor.`
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
    isFavorite: false,
    isPopular: true,
    previewContent: `Opening:

We gather today to celebrate the remarkable life of [Name], to honor their memory, and to find comfort in the legacy they leave behind.

Remembrance:

[Name] touched so many lives with their kindness, generosity, and love. Today we remember not how they died, but how they lived.

Reading:

"Do not stand at my grave and weep. I am not there; I do not sleep. I am a thousand winds that blow. I am the diamond glints on snow."

Celebration of Life:

Let us share stories and memories that bring smiles to our faces and warmth to our hearts.

Closing:

Though we will miss [Name] deeply, we find peace in knowing that their spirit lives on in each of us.`
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
    isFavorite: false,
    isPopular: false,
    previewContent: `Processional and Welcoming:

Baruch haba b'shem Adonai - Blessed are you who come in the name of the Lord. We welcome you under the chuppah.

Seven Blessings (Sheva Brachot):

Blessed are You, Lord our God, King of the universe, who created joy and gladness, groom and bride, mirth, glad song, pleasure, delight, love, brotherhood, peace, and companionship.

Ring Exchange:

Behold, you are consecrated to me with this ring according to the law of Moses and Israel.

Breaking of the Glass:

This act reminds us that even in our joy, we remember the destruction of the Temple and the fragility of relationships.

Mazel Tov!`
  },
  {
    id: 7,
    title: "ਪੰਜਾਬੀ ਵਿਆਹ ਦੀ ਰਸਮ",
    description: "Traditional Punjabi Sikh wedding ceremony script with Anand Karaj rituals and hymns.",
    price: 32.99,
    rating: 4.7,
    reviews: 64,
    category: "Cultural",
    type: "Wedding",
    language: "Punjabi",
    author: "Giani Harpreet Singh",
    tags: ["Sikh", "Punjabi", "Traditional"],
    isFavorite: false,
    isPopular: false,
    previewContent: `Anand Karaj Ceremony:

The Anand Karaj is the Sikh marriage ceremony, meaning "Blissful Union." The couple will walk around the Guru Granth Sahib four times.

Laavan - First Round:

In the first round, the Lord sets out His Instructions for performing the daily duties of married life.

Laavan - Second Round:

In the second round, the couple meets the True Guru, the Primal Being.

Ardas (Prayer):

We seek the blessings of Waheguru for this union. May this couple walk together on the path of Dharma.`
  },
  {
    id: 8,
    title: "हिंदू विवाह संस्कार",
    description: "Complete Hindu wedding ceremony script with Sanskrit mantras and traditional rituals.",
    price: 36.99,
    rating: 4.8,
    reviews: 98,
    category: "Hindu",
    type: "Wedding",
    language: "Hindi",
    author: "Pandit Raj Kumar Sharma",
    tags: ["Hindu", "Sanskrit", "Traditional"],
    isFavorite: false,
    isPopular: true,
    previewContent: `Saptapadi (Seven Steps):

साथ चलें सात कदम, जीवन भर का साथ निभाएं।

पहला कदम: भोजन के लिए
दूसरा कदम: शक्ति के लिए
तीसरा कदम: धन के लिए
चौथा कदम: सुख के लिए
पांचवां कदम: संतान के लिए
छठा कदम: ऋतुओं के लिए
सातवां कदम: मित्रता के लिए

Mangal Sutra:

यह मंगल सूत्र हमारे पवित्र बंधन का प्रतीक है।

Agni Parikrama:

अग्नि को साक्षी मानकर, हम सात फेरे लेते हैं।`
  },
  {
    id: 9,
    title: "Inclusive Love Celebration",
    description: "Beautiful LGBTQ+ wedding ceremony script celebrating love in all its forms with affirming language.",
    price: 32.99,
    rating: 4.9,
    reviews: 156,
    category: "Secular",
    type: "LGBTQ",
    language: "English",
    author: "Rev. Alex Rivera",
    tags: ["LGBTQ", "Inclusive", "Modern"],
    isFavorite: false,
    isPopular: true,
    previewContent: `Welcome and Celebration:

Welcome to this joyous celebration of love! Today we witness the union of two beautiful souls who have chosen to share their lives together.

Affirming Love:

Love is love. Your love is valid, beautiful, and worthy of celebration. Today we honor your commitment to each other.

Personal Vows:

[Partner 1] and [Partner 2], please share the vows you have written for each other.

Unity Ceremony:

As you blend these waters together, so too do you blend your lives, your hopes, and your dreams.

Pronouncement:

By the power of your love and the commitment you make here today, I pronounce you married! You may kiss!`
  },
  {
    id: 10,
    title: "Same-Sex Marriage Ceremony",
    description: "Heartfelt same-sex wedding script with personalized vows and inclusive traditions.",
    price: 29.99,
    rating: 4.8,
    reviews: 89,
    category: "Secular",
    type: "LGBTQ",
    language: "English",
    author: "Dr. Jordan Kim",
    tags: ["Same-Sex", "Personal", "Affirming"],
    isFavorite: false,
    isPopular: false,
    previewContent: `Opening Words:

We come together today to witness and celebrate the marriage of [Partner 1] and [Partner 2]. Your love story is an inspiration to all of us.

Reading on Partnership:

"A successful marriage requires falling in love many times, always with the same person."

Declaration of Intent:

[Partner 1], do you take [Partner 2] to be your spouse, to love and cherish, through all the days of your lives?

Personal Vows:

Please share the promises you make to each other today.

Ring Ceremony:

These rings represent your eternal love and commitment. Wear them as a symbol of the promises made here today.

Pronouncement:

I now pronounce you married partners in life!`
  },
  {
    id: 11,
    title: "Ceremonia LGBTQ+ Bilingüe",
    description: "Bilingual LGBTQ+ wedding ceremony celebrating diversity and love in Spanish and English.",
    price: 34.99,
    rating: 4.7,
    reviews: 72,
    category: "Cultural",
    type: "LGBTQ",
    language: "Spanish",
    author: "Rev. Maria Santos",
    tags: ["LGBTQ", "Bilingüe", "Inclusivo"],
    isFavorite: false,
    isPopular: false,
    previewContent: `Palabras de Apertura / Opening Words:

Bienvenidos a todos. Hoy celebramos el amor entre [Pareja 1] y [Pareja 2].
Welcome everyone. Today we celebrate the love between [Partner 1] and [Partner 2].

Lectura sobre el Amor / Reading on Love:

El amor es paciente, el amor es bondadoso. Love is patient, love is kind.

Intercambio de Votos / Exchange of Vows:

Por favor, compartan sus promesas. Please share your promises.

Ceremonia de los Anillos / Ring Ceremony:

Estos anillos simbolizan su amor eterno. These rings symbolize your eternal love.

Pronunciación / Pronouncement:

¡Los declaro casados! I now pronounce you married!`
  }
]

// Category translations
const categories = {
  en: {
    'All': 'All Categories',
    'Christian': 'Christian',
    'Catholic': 'Catholic',
    'Jewish': 'Jewish',
    'Muslim': 'Muslim',
    'Hindu': 'Hindu',
    'Secular': 'Non-Religious',
    'Cultural': 'Cultural',
    'Memorial': 'Memorial/Celebration of Life',
    'Military': 'Military'
  },
  es: {
    'All': 'Todas las Categorías',
    'Christian': 'Cristiana',
    'Catholic': 'Católica',
    'Jewish': 'Judía',
    'Muslim': 'Musulmana',
    'Hindu': 'Hindú',
    'Secular': 'No Religiosa',
    'Cultural': 'Cultural',
    'Memorial': 'Memorial/Celebración de Vida',
    'Military': 'Militar'
  }
}

const ceremonyTypes = {
  en: {
    'All': 'All Ceremonies',
    'Wedding': 'Weddings',
    'LGBTQ': 'LGBTQ Weddings',
    'Quinceañera': 'Quinceañera',
    'Celebration of Life': 'Celebration of Life',
    'Vow Renewal': 'Vow Renewals',
    'Baptism': 'Baptisms',
    'Memorial': 'Memorial Services'
  },
  es: {
    'All': 'Todas las Ceremonias',
    'Wedding': 'Bodas',
    'LGBTQ': 'Bodas LGBTQ',
    'Quinceañera': 'Quinceañera',
    'Celebration of Life': 'Celebración de Vida',
    'Vow Renewal': 'Renovación de Votos',
    'Baptism': 'Bautizos',
    'Memorial': 'Servicios Memoriales'
  }
}

// Language options
const availableLanguages = ['English', 'Spanish', 'Punjabi', 'Hindi', 'French', 'Chinese']

export function ScriptMarketplace() {
  const [purchaseStatus, setPurchaseStatus] = useState<'success' | 'cancelled' | null>(null)
  
  const handleStatusChange = useCallback((status: 'success' | 'cancelled' | null) => {
    setPurchaseStatus(status)
  }, [])
  
  return (
    <>
      <Suspense fallback={null}>
        <CheckoutHandler onStatusChange={handleStatusChange} />
      </Suspense>
      <Suspense fallback={<ScriptMarketplaceLoading />}>
        <ScriptMarketplaceContent purchaseStatus={purchaseStatus} setPurchaseStatus={setPurchaseStatus} />
      </Suspense>
    </>
  )
}

function ScriptMarketplaceLoading() {
  return (
    <div className="min-h-screen background-gradient">
      <div className="bg-white border-b border-light shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="w-80 space-y-6">
            <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
            <div className="h-48 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex-1">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
function ScriptMarketplaceContent({ purchaseStatus, setPurchaseStatus }: { purchaseStatus: 'success' | 'cancelled' | null, setPurchaseStatus: (status: 'success' | 'cancelled' | null) => void }) {
  const [mounted, setMounted] = useState(false)
  const [language, setLanguage] = useState<'en' | 'es'>('en')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('popular')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 75])
  const [minRating, setMinRating] = useState(0)
  const [currentTab, setCurrentTab] = useState('all')
  const [previewScript, setPreviewScript] = useState<Script | null>(null)
  const { getCartCount, setIsOpen, addToCart } = useCart()
  const { toggleFavorite, isFavorited, user } = useAuth()
  // Auto-dismiss success/cancelled message
  useEffect(() => {
    if (purchaseStatus) {
      const timer = setTimeout(() => {
        setPurchaseStatus(null)
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [purchaseStatus])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev =>
      prev.includes(lang)
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    )
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('All')
    setSelectedType('All')
    setSelectedLanguages([])
    setPriceRange([0, 75])
    setMinRating(0)
    setSortBy('popular')
  }

  const getFilteredScripts = () => {
    let filteredScripts = scripts.filter(script => {
      const matchesSearch = script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           script.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           script.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === 'All' || script.category === selectedCategory
      const matchesType = selectedType === 'All' || script.type === selectedType
      const matchesLanguage = selectedLanguages.length === 0 || selectedLanguages.includes(script.language)
      const matchesPrice = script.price >= priceRange[0] && script.price <= priceRange[1]
      const matchesRating = script.rating >= minRating

      return matchesSearch && matchesCategory && matchesType && matchesLanguage && matchesPrice && matchesRating
    })

    if (currentTab === 'favorites' && user) {
      filteredScripts = filteredScripts.filter(script => user.favoriteScripts.includes(script.id))
    }

    return filteredScripts.sort((a, b) => {
      switch (sortBy) {
        case 'popular': return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.rating - a.rating
        case 'price-low': return a.price - b.price
        case 'price-high': return b.price - a.price
        case 'rating': return b.rating - a.rating
        default: return 0
      }
    })
  }

  const filteredScripts = getFilteredScripts()
  const popularScripts = scripts.filter(script => script.isPopular).slice(0, 3)
  const favoritesCount = user ? user.favoriteScripts.length : 0

  const t: Translations = language === 'en' ? {
    title: 'Script Marketplace',
    subtitle: 'Find the perfect ceremony script for your special occasion',
    search: 'Search scripts...',
    categories: 'Categories',
    ceremonies: 'Ceremony Types',
    popular: 'Popular Scripts',
    results: 'Search Results',
    sortBy: 'Sort by',
    popular_sort: 'Most Popular',
    price_low: 'Price: Low to High',
    price_high: 'Price: High to Low',
    rating: 'Highest Rated',
    by: 'by',
    reviews: 'reviews',
    addToCart: 'Add to Cart',
    favorites: 'Favorites',
    allScripts: 'All Scripts',
    priceRange: 'Price Range',
    minRating: 'Minimum Rating',
    clearFilters: 'Clear Filters',
    noFavorites: 'No favorites yet. Click the heart icon on scripts to add them to your favorites!',
    addToFavorites: 'Add to favorites',
    removeFromFavorites: 'Remove from favorites'
  } : {
    title: 'Mercado de Guiones',
    subtitle: 'Encuentra el guión perfecto para tu ocasión especial',
    search: 'Buscar guiones...',
    categories: 'Categorías',
    ceremonies: 'Tipos de Ceremonia',
    popular: 'Guiones Populares',
    results: 'Resultados de Búsqueda',
    sortBy: 'Ordenar por',
    popular_sort: 'Más Popular',
    price_low: 'Precio: Menor a Mayor',
    price_high: 'Precio: Mayor a Menor',
    rating: 'Mejor Calificado',
    by: 'por',
    reviews: 'reseñas',
    addToCart: 'Agregar al Carrito',
    favorites: 'Favoritos',
    allScripts: 'Todos los Guiones',
    priceRange: 'Rango de Precio',
    minRating: 'Calificación Mínima',
    clearFilters: 'Limpiar Filtros',
    noFavorites: '¡Aún no tienes favoritos! Haz clic en el icono del corazón en los guiones para agregarlos a tus favoritos!',
    addToFavorites: 'Agregar a favoritos',
    removeFromFavorites: 'Quitar de favoritos'
  }

  return (
    <div className="min-h-screen background-gradient">
      {/* Purchase Status Banner */}
      {purchaseStatus === 'success' && (
        <div className="bg-green-500 text-white px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">
                {language === 'en'
                  ? 'Purchase successful! Your scripts are now available in your library.'
                  : '¡Compra exitosa! Tus guiones están ahora disponibles en tu biblioteca.'}
              </span>
            </div>
            <button
              onClick={() => setPurchaseStatus(null)}
              className="text-white hover:text-green-200 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {purchaseStatus === 'cancelled' && (
        <div className="bg-amber-500 text-white px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium">
                {language === 'en'
                  ? 'Checkout was cancelled. Your items are still in your cart.'
                  : 'El pago fue cancelado. Tus artículos aún están en tu carrito.'}
              </span>
            </div>
            <button
              onClick={() => setPurchaseStatus(null)}
              className="text-white hover:text-amber-200 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-light shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-gray-600 mt-1">{t.subtitle}</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Back to Portal */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://portal.ordainedpro.com', '_blank')}
                className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">Officiant Portal</span>
              </Button>

              {/* User Profile */}
              <UserProfile language={language} />

              {/* Cart Icon */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 relative"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Cart</span>
                {getCartCount() > 0 && (
                  <Badge
                    className="professional-writer absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {getCartCount()}
                  </Badge>
                )}
              </Button>

              {/* Language Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                className="flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                {language === 'en' ? 'Español' : 'English'}
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 space-y-6">
            {/* Advanced Filters */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Advanced Filters
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    {t.clearFilters}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-3 block">{t.priceRange}</label>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={(value) => setPriceRange([value[0], value[1]])}
                      max={75}
                      min={0}
                      step={5}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="text-sm font-medium mb-3 block">{t.minRating}</label>
                  <div className="space-y-2">
                    {[4.5, 4.0, 3.5, 3.0, 0].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox
                          id={`rating-${rating}`}
                          checked={minRating === rating}
                          onCheckedChange={() => setMinRating(minRating === rating ? 0 : rating)}
                        />
                        <label htmlFor={`rating-${rating}`} className="flex items-center gap-1 text-sm cursor-pointer">
                          {rating > 0 ? (
                            <>
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {rating}+ stars
                            </>
                          ) : (
                            'All ratings'
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Script Languages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Script Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableLanguages.map((lang) => (
                    <div key={lang} className="flex items-center space-x-2">
                      <Checkbox
                        id={`lang-${lang}`}
                        checked={selectedLanguages.includes(lang)}
                        onCheckedChange={() => toggleLanguage(lang)}
                      />
                      <label htmlFor={`lang-${lang}`} className="text-sm cursor-pointer flex items-center gap-2">
                        <span className="flex-1">{lang}</span>
                        <span className="text-xs text-gray-500">
                          ({scripts.filter(s => s.language === lang).length})
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
                {selectedLanguages.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500">
                      {selectedLanguages.length} language{selectedLanguages.length !== 1 ? 's' : ''} selected
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.categories}</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {Object.entries(categories[language]).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedCategory(key)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedCategory === key
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Ceremony Types */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.ceremonies}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(ceremonyTypes[language]).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedType(key)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedType === key
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Popular Scripts Section */}
            {searchTerm === '' && selectedCategory === 'All' && selectedType === 'All' && selectedLanguages.length === 0 && currentTab === 'all' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.popular}</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {popularScripts.map((script) => (
                    <ScriptCard
                      key={script.id}
                      script={script}
                      language={language}
                      t={t}
                      isFavorited={isFavorited(script.id)}
                      onToggleFavorite={() => toggleFavorite(script.id)}
                      onPreview={() => setPreviewScript(script)}
                    />
                  ))}
                </div>
                <Separator className="my-8" />

                {/* Featured Authors Section */}
                <UserShowcase language={language} onAuthorClick={(authorName) => {
                  // Find a script by this author
                  const authorScript = scripts.find(s => s.author === authorName)
                  if (authorScript) {
                    setPreviewScript(authorScript)
                  }
                }} />
                <Separator className="my-8" />
              </div>
            )}

            {/* Tabs for All Scripts vs Favorites */}
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <div className="flex items-center justify-between mb-6">
                <TabsList>
                  <TabsTrigger value="all">{t.allScripts}</TabsTrigger>
                  <TabsTrigger value="favorites" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    {t.favorites} ({favoritesCount})
                  </TabsTrigger>
                </TabsList>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={t.sortBy} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">{t.popular_sort}</SelectItem>
                    <SelectItem value="price-low">{t.price_low}</SelectItem>
                    <SelectItem value="price-high">{t.price_high}</SelectItem>
                    <SelectItem value="rating">{t.rating}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <TabsContent value="all">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {searchTerm || selectedCategory !== 'All' || selectedType !== 'All' || selectedLanguages.length > 0 ? t.results : t.allScripts}
                    <span className="text-gray-500 text-lg ml-2">({filteredScripts.length})</span>
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredScripts.map((script) => (
                    <ScriptCard
                      key={script.id}
                      script={script}
                      language={language}
                      t={t}
                      isFavorited={isFavorited(script.id)}
                      onToggleFavorite={() => toggleFavorite(script.id)}
                      onPreview={() => setPreviewScript(script)}
                    />
                  ))}
                </div>

                {filteredScripts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No scripts found matching your criteria.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="favorites">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t.favorites}
                    <span className="text-gray-500 text-lg ml-2">({filteredScripts.length})</span>
                  </h2>
                </div>

                {filteredScripts.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg max-w-md mx-auto">{t.noFavorites}</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredScripts.map((script) => (
                      <ScriptCard
                        key={script.id}
                        script={script}
                        language={language}
                        t={t}
                        isFavorited={isFavorited(script.id)}
                        onToggleFavorite={() => toggleFavorite(script.id)}
                        onPreview={() => setPreviewScript(script)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Script Preview Dialog */}
      <Dialog open={!!previewScript} onOpenChange={(open) => !open && setPreviewScript(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          {previewScript && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl pr-8">{previewScript.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-2">
                  <span className="text-sm">by</span>
                  <ScriptAuthor authorName={previewScript.author} size="sm" showName={true} />
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600">{previewScript.description}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Script Preview</h3>
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-gray-700">
                        {previewScript.previewContent}
                      </pre>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                    <div>
                      <p className="font-semibold text-lg">${previewScript.price}</p>
                      <p className="text-sm text-gray-600">Instant download after purchase</p>
                    </div>
                    <Button
                      onClick={() => {
                        addToCart({
                          id: previewScript.id,
                          title: previewScript.title,
                          price: previewScript.price,
                          language: previewScript.language,
                          author: previewScript.author,
                          category: previewScript.category,
                          type: previewScript.type
                        })
                        setPreviewScript(null)
                      }}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Cart Sidebar */}
      <CartSidebar language={language} />
    </div>
  )
}

function ScriptCard({
  script,
  language,
  t,
  isFavorited,
  onToggleFavorite,
  onPreview
}: {
  script: Script
  language: 'en' | 'es'
  t: Translations
  isFavorited: boolean
  onToggleFavorite: () => void
  onPreview: () => void
}) {
  const router = useRouter()
  const { addToCart } = useCart()
  const { isPurchased } = useAuth()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
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

  const purchased = isPurchased(script.id)

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer relative" onClick={onPreview}>
      {purchased && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="success text-xs">
            ✓ {language === 'en' ? 'Purchased' : 'Comprado'}
          </Badge>
        </div>
      )}
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
              {script.isPopular && (
                <Badge className="bg-primary text-primary-foreground text-xs">
                  {language === 'en' ? 'Popular' : 'Popular'}
                </Badge>
              )}
              {script.type === 'LGBTQ' && (
                <Badge className="lgbtq text-xs">
                  🏳️‍🌈 LGBTQ+
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite()
            }}
            className={`${isFavorited ? 'professional-writer' : 'text-gray-400 hover:text-red-500'} transition-colors`}
            title={isFavorited ? t.removeFromFavorites : t.addToFavorites}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
          </Button>
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

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{script.rating}</span>
            <span className="text-gray-500">({script.reviews} {t.reviews})</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {script.tags.slice(0, 3).map((tag: string, index: number) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="text-2xl font-bold text-gray-900">
          ${script.price}
        </div>
        <Button
          onClick={handleAddToCart}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {t.addToCart}
        </Button>
      </CardFooter>
    </Card>
  )
}
