'use client'

import { User } from 'lucide-react'
import { UserType } from '@/contexts/AuthContext'
import { ColoredAvatar } from '@/components/UserProfile'

interface ScriptAuthorProps {
  authorName: string
  userType?: UserType
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
  className?: string
}

// Map author names to user types for demo purposes
const getAuthorUserType = (authorName: string): UserType => {
  // For demonstration, we'll assign user types based on titles/names
  if (authorName.includes('Rev.') || authorName.includes('Rabbi') || authorName.includes('Father') || authorName.includes('Padre') || authorName.includes('Dr.') || authorName.includes('Pandit') || authorName.includes('Giani')) {
    return 'officiant'
  }

  // Female names -> bride for demo
  const femaleIndicators = ['Sarah', 'Jennifer', 'Maria', 'Elena']
  if (femaleIndicators.some(indicator => authorName.includes(indicator))) {
    return 'professional-writer'
  }

  // Male names -> groom for demo
  const maleIndicators = ['Michael', 'David', 'Robert', 'Miguel', 'Raj', 'Harpreet']
  if (maleIndicators.some(indicator => authorName.includes(indicator))) {
    return 'professional-writer'
  }

  // Default to officiant for religious titles
  return 'officiant'
}

export function ScriptAuthor({
  authorName,
  userType,
  size = 'sm',
  showName = true,
  className = ''
}: ScriptAuthorProps) {
  const detectedUserType = userType || getAuthorUserType(authorName)

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ColoredAvatar
        name={authorName}
        userType={detectedUserType}
        size={size}
      />
      {showName && (
        <span className="text-sm text-gray-600">{authorName}</span>
      )}
    </div>
  )
}
