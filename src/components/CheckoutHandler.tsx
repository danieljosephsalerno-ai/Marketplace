'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

interface CheckoutHandlerProps {
  onStatusChange: (status: 'success' | 'cancelled' | null) => void
}

export function CheckoutHandler({ onStatusChange }: CheckoutHandlerProps) {
  const searchParams = useSearchParams()
  const hasProcessed = useRef(false)

  useEffect(() => {
    // Only process once
    if (hasProcessed.current) return
    
    const purchase = searchParams.get('purchase')
    const sessionId = searchParams.get('session_id')

    if (purchase === 'success' && sessionId) {
      hasProcessed.current = true
      console.log('Purchase successful! Session:', sessionId)
      
      // Clear cart from localStorage directly
      try {
        localStorage.removeItem('scriptCart')
      } catch (e) {
        console.log('Could not clear cart from storage')
      }
      
      // Set status
      onStatusChange('success')
      
      // Clean up URL without causing React re-render
      window.history.replaceState({}, '', '/')
    } else if (purchase === 'cancelled') {
      hasProcessed.current = true
      onStatusChange('cancelled')
      window.history.replaceState({}, '', '/')
    }
  }, [searchParams, onStatusChange])

  return null
}
