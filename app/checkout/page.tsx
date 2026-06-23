"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShoppingCart, Trash, Calendar, User, Phone, Mail, FileText, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, isLoaded, removeItem, updateDates, clearCart, getDays, getTotal } = useCart()

  const [eventDate, setEventDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [eventName, setEventName] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [conflictItems, setConflictItems] = useState<string[]>([])

  useEffect(() => {
    if (isLoaded) {
      setEventDate(cart.eventDate || '')
      setReturnDate(cart.returnDate || '')
    }
  }, [isLoaded, cart.eventDate, cart.returnDate])

  const days = (() => {
    if (!eventDate || !returnDate) return 1
    const start = new Date(eventDate)
    const end = new Date(returnDate)
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1)
  })()

  const total = cart.items.reduce((sum, item) => sum + item.dailyRate * days, 0)
  const today = new Date().toISOString().split('T')[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setConflictItems([])

    if (!cart.items.length) {
      setError('Your cart is empty.')
      return
    }
    if (!eventDate || !returnDate) {
      setError('Please select event and return dates.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipmentIds: cart.items.map(i => i.equipmentId),
          customerName,
          customerEmail,
          customerPhone,
          eventName,
          eventDate,
          returnDate,
          notes
        })
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          setConflictItems(data.unavailableItems || [])
          setError(data.error || 'Some items are not available.')
        } else {
          setError(data.error || 'Failed to create booking. Please try again.')
        }
        return
      }

      clearCart()
      router.push(`/confirmation/${data.id}`)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-muted-foreground">
        Loading cart...
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
        <h2 className="text-xl font-semibold text-white mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add equipment from the catalog to get started.</p>
        <Link href="/">
          <Button className="bg-orange-500 hover:bg-orange-600 text-black font-semibold">
            Browse Equipment
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Equipment
        </Link>
        <h1 className="text-3xl font-black text-white">Checkout</h1>
        <p className="text-muted-foreground mt-1">Review your selections and submit your booking request.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-5">
            {/* Dates */}
            <div className="bg-card border border-white/8 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-orange-400" />
                <h2 className="font-semibold text-white">Event Dates</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Event Date *</Label>
                  <Input
                    type="date"
                    value={eventDate}
                    min={today}
                    onChange={e => {
                      setEventDate(e.target.value)
                      updateDates(e.target.value, returnDate)
                    }}
                    required
                    className="bg-background border-white/10 text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Return Date *</Label>
                  <Input
                    type="date"
                    value={returnDate}
                    min={eventDate || today}
                    onChange={e => {
                      setReturnDate(e.target.value)
                      updateDates(eventDate, e.target.value)
                    }}
                    required
                    className="bg-background border-white/10 text-white"
                  />
                </div>
              </div>
              {eventDate && returnDate && (
                <p className="mt-2 text-xs text-orange-400">
                  {days} day{days > 1 ? 's' : ''} rental · Total: ${total.toLocaleString()}
                </p>
              )}
            </div>

            {/* Customer Info */}
            <div className="bg-card border border-white/8 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-orange-400" />
                <h2 className="font-semibold text-white">Your Information</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Full Name *</Label>
                  <Input
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Jane Smith"
                    required
                    className="bg-background border-white/10 text-white placeholder:text-muted-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm text-muted-foreground">Email *</Label>
                    <Input
                      type="email"
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      placeholder="jane@email.com"
                      required
                      className="bg-background border-white/10 text-white placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm text-muted-foreground">Phone</Label>
                    <Input
                      type="tel"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="(561) 555-0000"
                      className="bg-background border-white/10 text-white placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-card border border-white/8 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-orange-400" />
                <h2 className="font-semibold text-white">Event Details</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Event Name</Label>
                  <Input
                    value={eventName}
                    onChange={e => setEventName(e.target.value)}
                    placeholder="Smith Wedding, Corporate Holiday Party, etc."
                    className="bg-background border-white/10 text-white placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Notes / Special Requests</Label>
                  <Textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Setup time, venue address, special instructions..."
                    rows={3}
                    className="bg-background border-white/10 text-white placeholder:text-muted-foreground resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <Alert className="border-red-500/30 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-400">
                  {error}
                  {conflictItems.length > 0 && (
                    <ul className="mt-2 list-disc list-inside">
                      {conflictItems.map(item => <li key={item}>{item}</li>)}
                    </ul>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={submitting || cart.items.length === 0}
              className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold h-12 text-base"
            >
              {submitting ? 'Submitting Booking Request...' : `Submit Booking Request — $${total.toLocaleString()}`}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              This submits a reservation request. AYP Services will confirm availability and contact you within 24 hours.
            </p>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-white/8 rounded-xl p-5 sticky top-20">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-4 h-4 text-orange-400" />
                <h2 className="font-semibold text-white">Order Summary</h2>
                <span className="text-muted-foreground text-sm ml-auto">{cart.items.length} item{cart.items.length > 1 ? 's' : ''}</span>
              </div>

              <div className="space-y-3 mb-4">
                {cart.items.map(item => (
                  <div key={item.equipmentId} className="flex items-start gap-2 group">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white font-medium leading-tight truncate">{item.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        ${item.dailyRate}/day × {days} day{days > 1 ? 's' : ''}
                        {' = '}
                        <span className="text-orange-400 font-medium">${(item.dailyRate * days).toLocaleString()}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.equipmentId)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-400 flex-shrink-0 mt-0.5"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <Separator className="bg-white/8 mb-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>{cart.items.length} item{cart.items.length > 1 ? 's' : ''} × {days} day{days > 1 ? 's' : ''}</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                {eventDate && returnDate && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Dates</span>
                    <span>{eventDate} → {returnDate}</span>
                  </div>
                )}
                <Separator className="bg-white/8" />
                <div className="flex justify-between font-bold text-white text-base">
                  <span>Total</span>
                  <span className="text-orange-400">${total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-orange-500/5 border border-orange-500/15 rounded-lg">
                <p className="text-xs text-orange-400/80 leading-relaxed">
                  <strong className="text-orange-400">No payment now.</strong> Submit your request and AYP Services will confirm availability and send a payment link within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>
  )
}
