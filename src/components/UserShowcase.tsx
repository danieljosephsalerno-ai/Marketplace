'use client'

import { User, BookOpen, Star } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UserType } from '@/contexts/AuthContext'
import { ColoredAvatar } from '@/components/UserProfile'

interface FeaturedUser {
  id: string
  name: string
  userType: UserType
  rating: number
  scriptsCount: number
  specialties: string[]
  location?: string
}

const featuredUsers: FeaturedUser[] = [
  {
    id: '1',
    name: 'Rev. Sarah Johnson',
    userType: 'officiant',
    rating: 4.9,
    scriptsCount: 12,
    specialties: ['Christian', 'Traditional', 'Outdoor'],
    location: 'San Francisco, CA'
  },
  {
    id: '2',
    name: 'Jennifer Park',
    userType: 'professional-writer',
    rating: 4.8,
    scriptsCount: 8,
    specialties: ['Modern', 'Secular', 'Personal'],
    location: 'Austin, TX'
  },
  {
    id: '3',
    name: 'Rabbi David Goldstein',
    userType: 'officiant',
    rating: 4.9,
    scriptsCount: 15,
    specialties: ['Jewish', 'Traditional', 'Reform'],
    location: 'New York, NY'
  },
  {
    id: '4',
    name: 'Dr. Robert Chen',
    userType: 'professional-writer',
    rating: 4.7,
    scriptsCount: 6,
    specialties: ['Memorial', 'Celebration', 'Uplifting'],
    location: 'Seattle, WA'
  }
]

interface UserShowcaseProps {
  language: 'en' | 'es'
  onAuthorClick?: (authorName: string) => void
}

export function UserShowcase({ language, onAuthorClick }: UserShowcaseProps) {
  const t = language === 'en' ? {
    title: 'Featured Script Authors',
    subtitle: 'Meet our top-rated authors and their specialties',
    'professional-writer': 'Professional Writer',
    officiant: 'Officiant',
    scripts: 'Scripts',
    rating: 'Rating',
    specialties: 'Specialties'
  } : {
    title: 'Autores Destacados',
    subtitle: 'Conoce a nuestros autores mejor calificados y sus especialidades',
    'professional-writer': 'Escritor Profesional',
    officiant: 'Oficiante',
    scripts: 'Guiones',
    rating: 'Calificación',
    specialties: 'Especialidades'
  }

  const getUserTypeIcon = (userType: UserType) => {
    switch (userType) {
      case 'professional-writer':
        return <User className="h-4 w-4" />
      case 'officiant':
        return <BookOpen className="h-4 w-4" />
      default:
        return null
    }
  }

  const getUserTypeColor = (userType: UserType) => {
    switch (userType) {
      case 'professional-writer':
        return 'marketplace'
      case 'officiant':
        return 'officiant'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredUsers.map((user) => (
          <Card key={user.id} className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => onAuthorClick?.(user.name)}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {user.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge className={`${getUserTypeColor(user.userType)} text-xs`}>
                      {getUserTypeIcon(user.userType)}
                      {user.userType === 'guest' ? 'Guest' : t[user.userType as keyof typeof t]}
                    </Badge>
                    {user.location && (
                      <Badge variant="secondary" className="text-xs">
                        {user.location}
                      </Badge>
                    )}
                  </div>
                </div>
                <ColoredAvatar
                  name={user.name}
                  userType={user.userType}
                  size="md"
                />
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                Top-rated {user.userType === 'professional-writer' ? 'script writer' : 'officiant'} specializing in {user.specialties.slice(0, 2).join(' and ')} ceremonies.
              </p>

              <div className="flex items-center gap-4 text-sm mb-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{user.rating}</span>
                  <span className="text-gray-500">({user.scriptsCount} {t.scripts})</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mt-3">
                {user.specialties.slice(0, 3).map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-end">
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={(e) => {
                  e.stopPropagation()
                  onAuthorClick?.(user.name)
                }}
              >
                View {t.scripts}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
