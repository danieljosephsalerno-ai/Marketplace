'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Minus, Plus, ShoppingCart, Trash2, CreditCard, Check, Loader2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ScriptAuthor } from '@/components/ScriptAuthor'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface CartSidebarProps {
  language: 'en' | 'es'
}

export function CartSidebar({ language }: CartSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isOpen,
    setIsOpen
  } = useCart()
  const { addPurchase, isAuthenticated, user } = useAuth()
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  // Handle successful payment redirect
  useEffect(() => {
    const purchaseStatus = searchParams.get('purchase')
    if (purchaseStatus === 'success') {
      clearCart()
      setShowSuccessDialog(true)
      // Clean up URL
      router.replace('/', { scroll: false })
    }
  }, [searchParams, clearCart, router])

  const t = language === 'en' ? {
    cart: 'Shopping Cart',
    empty: 'Your cart is currently empty',
    startShopping: 'Start Shopping',
    quantity: 'Qty',
    remove: 'Remove',
    subtotal: 'Subtotal',
    total: 'Total',
    clearCart: 'Clear Cart',
    checkout: 'Proceed to Checkout',
    item: 'item',
    items: 'items',
    by: 'by',
    purchaseSuccess: 'Purchase Successful!',
    purchaseMessage: 'Your scripts have been added to your library.',
    continueShopping: 'Continue Shopping',
    loginRequired: 'Please login to complete your purchase'
  } : {
    cart: 'Carrito de Compras',
    empty: 'Tu carrito está vacío',
    startShopping: 'Comenzar a Comprar',
    quantity: 'Cant.',
    remove: 'Eliminar',
    subtotal: 'Subtotal',
    total: 'Total',
    clearCart: 'Vaciar Carrito',
    checkout: 'Proceder al Pago',
    item: 'artículo',
    items: 'artículos',
    by: 'por',
    purchaseSuccess: '¡Compra Exitosa!',
    purchaseMessage: 'Tus guiones se han agregado a tu biblioteca.',
    continueShopping: 'Continuar Comprando',
    loginRequired: 'Por favor inicia sesión para completar tu compra'
  }

  const handleCheckout = async () => {
    if (!isAuthenticated || !user) {
      alert(t.loginRequired)
      return
    }

    setIsCheckingOut(true)

    try {
      // Call checkout API to create Stripe session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          })),
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Checkout API error:', data)
        throw new Error(data.error || 'Checkout failed')
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(language === 'en'
        ? `Checkout failed: ${errorMessage}. Please try again.`
        : `Error en el pago: ${errorMessage}. Por favor, inténtalo de nuevo.`)
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-[400px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {t.cart}
            {getCartCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getCartCount()} {getCartCount() === 1 ? t.item : t.items}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-4">{t.empty}</p>
              <Button onClick={() => setIsOpen(false)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {t.startShopping}
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-sm line-clamp-2">{item.title}</h3>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-gray-500">{t.by}</span>
                            <ScriptAuthor authorName={item.author} size="sm" showName={true} />
                          </div>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                            <Badge className="success text-xs">
                              {item.language}
                            </Badge>
                            {item.type === 'LGBTQ' && (
                              <Badge className="lgbtq text-xs">
                                🏳️‍🌈 LGBTQ+
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title={t.remove}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{t.quantity}:</span>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                          {item.quantity > 1 && (
                            <div className="text-xs text-gray-500">${item.price.toFixed(2)} each</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t pt-4 mt-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>{t.subtotal}:</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg">
                    <span>{t.total}:</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="lg"
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CreditCard className="h-4 w-4 mr-2" />
                    )}
                    {isCheckingOut ? (language === 'en' ? 'Processing...' : 'Procesando...') : t.checkout}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="w-full"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t.clearCart}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">{t.purchaseSuccess}</DialogTitle>
            <DialogDescription className="text-center">
              {t.purchaseMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button onClick={() => setShowSuccessDialog(false)} className="bg-primary hover:bg-primary/90">
              {t.continueShopping}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
