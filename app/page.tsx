"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, ShoppingCart, Check, Calendar, X, Filter } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'
import { Equipment, EquipmentCategory } from '@/types'

const CATEGORIES: { value: EquipmentCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Gear' },
  { value: 'audio', label: '🔊 Audio' },
  { value: 'lighting', label: '💡 Lighting' },
  { value: 'booth', label: '📷 Booths' },
  { value: 'visual', label: '📺 Visual' },
  { value: 'av', label: '🎶 AV' },
]

const CATEGORY_COLORS: Record<string, string> = {
  audio: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  lighting: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  booth: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  visual: 'bg-green-500/10 text-green-400 border-green-500/20',
  av: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
}

interface EquipmentWithAvailability extends Equipment {
  available?: boolean
}

export default function HomePage() {
  const { cart, isLoaded, addItem, removeItem, isInCart, updateDates } = useCart()
  const [equipment, setEquipment] = useState<EquipmentWithAvailability[]>([])
  const [category, setCategory] = useState<EquipmentCategory | 'all'>('all')
  const [search, setSearch] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [datesChecked, setDatesChecked] = useState(false)

  // Load initial equipment
  useEffect(() => {
    fetch('/api/equipment')
      .then(r => r.json())
      .then(setEquipment)
  }, [])

  // Sync dates from cart on load
  useEffect(() => {
    if (isLoaded && cart.eventDate) {
      setEventDate(cart.eventDate)
      setReturnDate(cart.returnDate)
    }
  }, [isLoaded])

  const checkAvailability = useCallback(async () => {
    if (!eventDate || !returnDate) return
    setIsChecking(true)
    try {
      const res = await fetch(`/api/equipment?eventDate=${eventDate}&returnDate=${returnDate}`)
      const data = await res.json()
      setEquipment(data)
      setDatesChecked(true)
      updateDates(eventDate, returnDate)
    } finally {
      setIsChecking(false)
    }
  }, [eventDate, returnDate, updateDates])

  const clearDates = () => {
    setEventDate('')
    setReturnDate('')
    setDatesChecked(false)
    fetch('/api/equipment').then(r => r.json()).then(setEquipment)
    updateDates('', '')
  }

  const filtered = equipment.filter(e => {
    const matchesCat = category === 'all' || e.category === category
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  const today = new Date().toISOString().split('T')[0]

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1 text-orange-400 text-sm mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          Palm Beach Gardens, FL
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight">
          Professional AV{' '}
          <span className="text-orange-400">Equipment Rental</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          DJ gear, photo booths, lighting, speakers & more — 30 years of experience backing every rental.
        </p>
      </motion.div>

      {/* Date Availability Checker */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-orange-500/20 rounded-xl p-5 mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-orange-400" />
          <h2 className="font-semibold text-white">Check Availability for Your Event</h2>
          {datesChecked && (
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs border">
              ✓ Availability shown below
            </Badge>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Event Date</label>
            <Input
              type="date"
              value={eventDate}
              min={today}
              onChange={e => setEventDate(e.target.value)}
              className="bg-background border-white/10 text-white"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Return Date</label>
            <Input
              type="date"
              value={returnDate}
              min={eventDate || today}
              onChange={e => setReturnDate(e.target.value)}
              className="bg-background border-white/10 text-white"
            />
          </div>
          <div className="flex items-end gap-2">
            <Button
              onClick={checkAvailability}
              disabled={!eventDate || !returnDate || isChecking}
              className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
            >
              {isChecking ? 'Checking...' : 'Check Availability'}
            </Button>
            {datesChecked && (
              <Button variant="ghost" onClick={clearDates} className="text-muted-foreground hover:text-white">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        {eventDate && returnDate && !datesChecked && (
          <p className="text-xs text-muted-foreground mt-2">
            Click "Check Availability" to see which items are available for your dates.
          </p>
        )}
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search equipment..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-card border-white/10 text-white placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                category === cat.value
                  ? 'bg-orange-500 text-black'
                  : 'bg-card text-muted-foreground hover:text-white border border-white/10'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Filter className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p>No equipment matches your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item, i) => {
            const inCart = isInCart(item.equipmentId ?? item.id)
            const isAvailable = item.available
            const daysCount = cart.eventDate && cart.returnDate
              ? Math.max(1, Math.ceil((new Date(cart.returnDate).getTime() - new Date(cart.eventDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)
              : 1

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={cn(
                  'relative bg-card rounded-xl border transition-all duration-200 flex flex-col overflow-hidden group',
                  inCart
                    ? 'border-orange-500/60 shadow-lg shadow-orange-500/10'
                    : datesChecked && isAvailable === false
                    ? 'border-red-500/30 opacity-60'
                    : 'border-white/8 hover:border-orange-500/30'
                )}
              >
                {/* Top accent */}
                <div className="h-1 w-full bg-gradient-to-r from-orange-500/40 to-transparent" />

                <div className="p-4 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">{item.emoji}</div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={cn('text-xs border', CATEGORY_COLORS[item.category])}>
                        {item.category.toUpperCase()}
                      </Badge>
                      {datesChecked && (
                        <Badge className={cn(
                          'text-xs border',
                          isAvailable
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        )}>
                          {isAvailable ? '✓ Available' : '✗ Booked'}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <h3 className="font-semibold text-white text-sm leading-tight mb-1">{item.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Features preview */}
                  <div className="mb-3">
                    {item.features.slice(0, 2).map(f => (
                      <div key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5">
                        <span className="w-1 h-1 rounded-full bg-orange-400 flex-shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <span className="text-xl font-black text-white">${item.dailyRate.toLocaleString()}</span>
                      <span className="text-muted-foreground text-xs">/day</span>
                    </div>
                    {datesChecked && cart.eventDate && (
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">{daysCount} day{daysCount > 1 ? 's' : ''}</div>
                        <div className="text-sm font-bold text-orange-400">${(item.dailyRate * daysCount).toLocaleString()}</div>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  {datesChecked && isAvailable === false ? (
                    <Button disabled className="w-full text-xs h-9 bg-red-500/10 text-red-400 border border-red-500/20">
                      Not Available
                    </Button>
                  ) : inCart ? (
                    <Button
                      onClick={() => removeItem(item.id)}
                      variant="outline"
                      className="w-full text-xs h-9 bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                    >
                      <Check className="w-3.5 h-3.5 mr-1.5" />
                      In Cart — Remove
                    </Button>
                  ) : (
                    <Button
                      onClick={() => addItem({
                        equipmentId: item.id,
                        name: item.name,
                        dailyRate: item.dailyRate,
                        category: item.category,
                        slug: item.slug
                      })}
                      className="w-full text-xs h-9 bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500 hover:text-black hover:border-orange-500"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                      Add to Cart
                    </Button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Cart Summary Banner */}
      {isLoaded && cart.items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-orange-500 text-black rounded-xl px-6 py-3 flex items-center gap-4 shadow-2xl shadow-orange-500/30"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="font-semibold">
            {cart.items.length} item{cart.items.length > 1 ? 's' : ''} in cart
          </span>
          <a
            href="/checkout"
            className="bg-black text-white font-bold text-sm px-4 py-1.5 rounded-lg hover:bg-black/80 transition-colors"
          >
            Checkout →
          </a>
        </motion.div>
      )}
    </main>
  )
}
