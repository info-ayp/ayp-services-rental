"use client"

import { useEffect, useState, use } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Calendar, Package, User, Phone, Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Booking } from '@/types'

export default function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then(async r => {
        if (!r.ok) throw new Error('Booking not found')
        return r.json()
      })
      .then(data => { setBooking(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [id])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-muted-foreground">
        Loading booking...
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-red-400 mb-4">Booking not found.</p>
        <Link href="/">
          <Button className="bg-orange-500 hover:bg-orange-600 text-black font-semibold">
            Go Home
          </Button>
        </Link>
      </div>
    )
  }

  const totalAmount = booking.totalAmount

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Booking Request Received!</h1>
        <p className="text-muted-foreground">
          We'll confirm availability and contact you within 24 hours.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card border border-white/8 rounded-xl overflow-hidden"
      >
        {/* Booking ID header */}
        <div className="bg-orange-500/10 border-b border-orange-500/20 p-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Booking Reference</div>
            <div className="font-mono font-bold text-orange-400 text-lg">{booking.id}</div>
          </div>
          <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 border">
            ⏳ Pending Confirmation
          </Badge>
        </div>

        <div className="p-5 space-y-5">
          {/* Event Dates */}
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-white mb-1">Event Dates</div>
              <div className="text-sm text-muted-foreground">
                {booking.eventDate === booking.returnDate
                  ? `${booking.eventDate} (1 day)`
                  : `${booking.eventDate} → ${booking.returnDate} (${booking.days} days)`}
              </div>
              {booking.eventName && (
                <div className="text-xs text-orange-400 mt-0.5">{booking.eventName}</div>
              )}
            </div>
          </div>

          <Separator className="bg-white/8" />

          {/* Equipment */}
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium text-white mb-2">Equipment Rented</div>
              <div className="space-y-2">
                {booking.items.map(item => (
                  <div key={item.equipmentId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="text-white">
                      ${item.dailyRate}/day × {booking.days} = <span className="text-orange-400 font-medium">${(item.dailyRate * booking.days).toLocaleString()}</span>
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="bg-white/8 my-3" />
              <div className="flex justify-between font-bold">
                <span className="text-white">Total</span>
                <span className="text-orange-400 text-lg">${totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Separator className="bg-white/8" />

          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground">Name</div>
                <div className="text-sm text-white">{booking.customerName}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground">Email</div>
                <div className="text-sm text-white break-all">{booking.customerEmail}</div>
              </div>
            </div>
            {booking.customerPhone && (
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground">Phone</div>
                  <div className="text-sm text-white">{booking.customerPhone}</div>
                </div>
              </div>
            )}
          </div>

          {booking.notes && (
            <>
              <Separator className="bg-white/8" />
              <div>
                <div className="text-xs text-muted-foreground mb-1">Notes</div>
                <div className="text-sm text-white">{booking.notes}</div>
              </div>
            </>
          )}
        </div>

        {/* Footer CTA */}
        <div className="border-t border-white/8 p-5 bg-green-500/5">
          <p className="text-sm text-green-400 mb-4">
            ✉️ A confirmation with your booking details and next steps will be sent to <strong>{booking.customerEmail}</strong>.
          </p>
          <Link href="/">
            <Button className="bg-orange-500 hover:bg-orange-600 text-black font-semibold">
              Book More Equipment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
