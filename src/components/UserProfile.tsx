'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, LogOut, Settings, ChevronDown, Library, Heart } from 'lucide-react'
import { useAuth, UserType } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { AuthDialog } from '@/components/AuthDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Re-export UserType for convenience
export type { UserType } from '@/contexts/AuthContext'

interface UserProfileProps {
  language: 'en' | 'es'
}

export function UserProfile({ language }: UserProfileProps) {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const [authDialogOpen, setAuthDialogOpen] = useState(false)

  const t = language === 'en' ? {
    signup: 'Signup',
    login: 'Login',
    logout: 'Logout',
    settings: 'Settings',
    profile: 'Profile',
    myLibrary: 'My Library',
    favorites: 'Favorites'
  } : {
    signup: 'Registrarse',
    login: 'Iniciar Sesión',
    logout: 'Cerrar Sesión',
    settings: 'Configuración',
    profile: 'Perfil',
    myLibrary: 'Mi Biblioteca',
    favorites: 'Favoritos'
  }

  // If user is logged in, show avatar with dropdown menu
  if (isAuthenticated && user) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 p-2">
              <ColoredAvatar
                name={user.name}
                userType={user.userType}
                size="sm"
              />
              <span className="hidden sm:inline">{user.name}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => router.push('/library')}>
              <Library className="h-4 w-4 mr-2" />
              {t.myLibrary}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="h-4 w-4 mr-2" />
              {t.profile}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              {t.settings}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              {t.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
  }

  // If user is not logged in, show Signup button
  return (
    <>
      <Button variant="outline" className="flex items-center gap-2" onClick={() => setAuthDialogOpen(true)}>
        <User className="h-4 w-4" />
        {t.signup}
      </Button>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} language={language} />
    </>
  )
}

// Reusable colored avatar component
interface ColoredAvatarProps {
  name: string
  userType: UserType
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ColoredAvatar({ name, userType, size = 'md', className = '' }: ColoredAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-lg'
  }

  const getUserTypeColor = (userType: UserType) => {
    switch (userType) {
      case 'professional-writer':
        return 'marketplace'
      case 'officiant':
        return 'officiant'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className={`${sizeClasses[size]} ${getUserTypeColor(userType)} rounded-full flex items-center justify-center font-medium ${className}`}>
      {getInitials(name)}
    </div>
  )
}
