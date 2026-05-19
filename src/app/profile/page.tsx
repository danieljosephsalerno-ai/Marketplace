'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, User, Mail, MapPin, Calendar, Users, Save, Edit2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ColoredAvatar } from '@/components/UserProfile'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, updateUser } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Edit form state
  const [editName, setEditName] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [editPartner, setEditPartner] = useState('')
  const [editWeddingDate, setEditWeddingDate] = useState('')

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated) {
      router.push('/')
    }
    if (user) {
      setEditName(user.name)
      setEditLocation(user.location || '')
      setEditPartner(user.partner || '')
      setEditWeddingDate(user.weddingDate || '')
    }
  }, [isAuthenticated, router, user])

  if (!mounted || !user) {
    return null
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Update user profile (this would typically call an API)
      if (updateUser) {
        await updateUser({
          name: editName,
          location: editLocation,
          partner: editPartner,
          weddingDate: editWeddingDate
        })
      }
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const getUserTypeBadge = (userType: string) => {
    switch (userType) {
      case 'professional-writer':
        return <Badge className="marketplace">Professional Writer</Badge>
      case 'officiant':
        return <Badge className="officiant">Officiant</Badge>
      default:
        return <Badge variant="secondary">Guest</Badge>
    }
  }

  return (
    <div className="min-h-screen background-gradient">
      <div className="bg-white border-b border-light shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">View and manage your account information</p>
            </div>
            <Button variant="outline" onClick={() => router.push('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                <ColoredAvatar
                  name={user.name}
                  userType={user.userType}
                  size="lg"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="mt-2">
                    {getUserTypeBadge(user.userType)}
                  </div>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                {isEditing ? 'Update your personal information below' : 'Your personal details and account information'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="edit-name"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="edit-location"
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          placeholder="City, State"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    {user.userType === 'professional-writer' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="edit-partner">Partner Name</Label>
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="edit-partner"
                              value={editPartner}
                              onChange={(e) => setEditPartner(e.target.value)}
                              placeholder="Partner's name"
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-wedding-date">Wedding Date</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="edit-wedding-date"
                              type="date"
                              value={editWeddingDate}
                              onChange={(e) => setEditWeddingDate(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      {user.name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {user.email}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {user.location || 'Not set'}
                    </p>
                  </div>
                  {user.userType === 'professional-writer' && (
                    <>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Partner</p>
                        <p className="font-medium flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          {user.partner || 'Not set'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Wedding Date</p>
                        <p className="font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {user.weddingDate || 'Not set'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-primary">{user.purchasedScripts.length}</p>
                  <p className="text-sm text-gray-500">Purchased Scripts</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-primary">{user.favoriteScripts.length}</p>
                  <p className="text-sm text-gray-500">Favorites</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-primary">
                    {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-500">Member Since</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
