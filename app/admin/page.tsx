"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Settings, Lock, Eye, EyeOff, CheckCircle, XCircle, Clock,
  Calendar, Package, User, Phone, DollarSign, RefreshCw,
  Filter, AlertTriangle, Check, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Booking, BookingStatus } from '@/types'

const ADMIN_KEY = 'ayp2024'

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending:   { label: 'Pending',   color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',   icon: <Clock className="w-3 h-3" /> },
  confirmed: { label: 'Confirmed', color: 'bg-green-500/10 text-green-400 border-green-500/20',      icon: <CheckCircle className="w-3 h-3" /> },
  completed: { label: 'Completed', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',         icon: <Check className="w-3 h-3" /> },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-400 border-red-500/20',            icon: <XCircle className="w-3 h-3" /> },
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    try {
      if (localStorage.getItem('ayp_admin') === ADMIN_KEY) {
        setIsAuthenticated(true)
      }
    } catch {}
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_KEY) {
      setIsAuthenticated(true)
      setAuthError('')
      try { localStorage.setItem('ayp_admin', ADMIN_KEY) } catch {}
    } else {
      setAuthError('Incorrect password.')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    try { localStorage.removeItem('ayp_admin') } catch {}
  }

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/bookings?key=${ADMIN_KEY}`)
      if (res.ok) {
        const data = await res.json()
        setBookings(data)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) fetchBookings()
  }, [isAuthenticated, fetchBookings])

  const updateStatus = async (id: string, status: BookingStatus) => {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/bookings/${id}?key=${ADMIN_KEY}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        const updated = await res.json()
        setBookings(prev => prev.map(b => b.id === id ? updated : b))
      }
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = bookings.filter(b => statusFilter === 'all' || b.status === statusFilter)

  // Stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    revenue: bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.totalAmount, 0)
  }

  // Upcoming bookings (next 30 days)
  const today = new Date()
  const in30 = new Date(today); in30.setDate(today.getDate() + 30)
  const upcoming = bookings
    .filter(b => {
      const d = new Date(b.eventDate)
      return d >= today && d <= in30 && b.status !== 'cancelled'
    })
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-orange-400" />
            </div>
            <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">AYP Services Equipment Rental</p>
          </div>

          <form onSubmit={handleLogin} className="bg-card border border-white/8 rounded-xl p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="bg-background border-white/10 text-white pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && <p className="text-red-400 text-xs">{authError}</p>}
            </div>
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold">
              Sign In
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-4">Default password: ayp2024</p>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage equipment rental bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={fetchBookings}
            variant="outline"
            size="sm"
            className="border-white/10 text-muted-foreground hover:text-white"
            disabled={loading}
          >
            <RefreshCw className={cn("w-4 h-4 mr-1.5", loading && "animate-spin")} />
            Refresh
          </Button>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-white"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Bookings', value: stats.total, icon: <Package className="w-5 h-5" />, color: 'text-white' },
          { label: 'Pending', value: stats.pending, icon: <Clock className="w-5 h-5" />, color: 'text-yellow-400' },
          { label: 'Confirmed', value: stats.confirmed, icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-400' },
          { label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: <DollarSign className="w-5 h-5" />, color: 'text-orange-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-white/8 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
              {stat.icon}
              <span className="text-xs font-medium">{stat.label}</span>
            </div>
            <div className={cn("text-2xl font-black", stat.color)}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Upcoming Events */}
      {upcoming.length > 0 && (
        <div className="bg-card border border-orange-500/20 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-orange-400" />
            <h2 className="font-semibold text-white">Upcoming — Next 30 Days</h2>
            <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 border text-xs">{upcoming.length}</Badge>
          </div>
          <div className="space-y-2">
            {upcoming.map(b => {
              const daysUntil = Math.ceil((new Date(b.eventDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
              return (
                <div key={b.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className="text-center w-10 flex-shrink-0">
                    <div className="text-xs text-muted-foreground">in</div>
                    <div className="font-bold text-orange-400 text-lg leading-none">{daysUntil}</div>
                    <div className="text-xs text-muted-foreground">days</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{b.customerName} — {b.eventName || 'Event'}</div>
                    <div className="text-xs text-muted-foreground">
                      {b.eventDate} · {b.items.length} item{b.items.length > 1 ? 's' : ''} · ${b.totalAmount.toLocaleString()}
                    </div>
                  </div>
                  <Badge className={cn('text-xs border flex items-center gap-1', STATUS_CONFIG[b.status].color)}>
                    {STATUS_CONFIG[b.status].icon}
                    {STATUS_CONFIG[b.status].label}
                  </Badge>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* All Bookings */}
      <div className="bg-card border border-white/8 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-semibold text-white">All Bookings</h2>
          </div>
          <Select value={statusFilter} onValueChange={v => setStatusFilter(v as BookingStatus | 'all')}>
            <SelectTrigger className="w-36 bg-background border-white/10 text-white h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-white/10">
              <SelectItem value="all" className="text-white">All Status</SelectItem>
              <SelectItem value="pending" className="text-yellow-400">Pending</SelectItem>
              <SelectItem value="confirmed" className="text-green-400">Confirmed</SelectItem>
              <SelectItem value="completed" className="text-blue-400">Completed</SelectItem>
              <SelectItem value="cancelled" className="text-red-400">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading bookings...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No bookings found.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map(booking => (
              <div key={booking.id} className="p-5">
                <div
                  className="flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                >
                  {/* Left */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-orange-400">{booking.id}</span>
                      <Badge className={cn('text-xs border flex items-center gap-1', STATUS_CONFIG[booking.status].color)}>
                        {STATUS_CONFIG[booking.status].icon}
                        {STATUS_CONFIG[booking.status].label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="font-semibold text-white text-sm">{booking.customerName}</span>
                      <span className="text-muted-foreground text-xs">{booking.customerEmail}</span>
                      {booking.customerPhone && (
                        <span className="text-muted-foreground text-xs">{booking.customerPhone}</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      📅 {booking.eventDate}{booking.days > 1 ? ` → ${booking.returnDate}` : ''} · {booking.days} day{booking.days > 1 ? 's' : ''} · {booking.items.length} item{booking.items.length > 1 ? 's' : ''}
                      {booking.eventName && ` · ${booking.eventName}`}
                    </div>
                  </div>

                  {/* Right: Total + Actions */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-orange-400 font-bold">${booking.totalAmount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{new Date(booking.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === booking.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4"
                  >
                    <Separator className="bg-white/8 mb-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Equipment list */}
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-2">EQUIPMENT</div>
                        {booking.items.map(item => (
                          <div key={item.equipmentId} className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{item.name}</span>
                            <span className="text-white">${(item.dailyRate * booking.days).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      {/* Notes */}
                      <div>
                        {booking.notes && (
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-2">NOTES</div>
                            <p className="text-sm text-white bg-black/20 p-2 rounded">{booking.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Actions */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <div className="text-xs text-muted-foreground flex items-center mr-2">Update Status:</div>
                      {booking.status !== 'confirmed' && booking.status !== 'cancelled' && (
                        <Button
                          size="sm"
                          onClick={() => updateStatus(booking.id, 'confirmed')}
                          disabled={updatingId === booking.id}
                          className="h-7 text-xs bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-black"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Confirm
                        </Button>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button
                          size="sm"
                          onClick={() => updateStatus(booking.id, 'completed')}
                          disabled={updatingId === booking.id}
                          className="h-7 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-black"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Mark Complete
                        </Button>
                      )}
                      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <Button
                          size="sm"
                          onClick={() => updateStatus(booking.id, 'cancelled')}
                          disabled={updatingId === booking.id}
                          className="h-7 text-xs bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-black"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Cancel Booking
                        </Button>
                      )}
                      {booking.status === 'cancelled' && (
                        <Button
                          size="sm"
                          onClick={() => updateStatus(booking.id, 'pending')}
                          disabled={updatingId === booking.id}
                          className="h-7 text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500 hover:text-black"
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          Restore
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Equipment Availability Overview */}
      <div className="mt-8 bg-card border border-white/8 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-orange-400" />
          <h2 className="font-semibold text-white">Double-Booking Protection</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          All bookings go through the availability API — each piece of equipment can only have one active booking per date range.
          Cancelled bookings free up the equipment for re-booking. When customers attempt to book already-reserved equipment,
          they receive an error message showing which items are unavailable.
        </p>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-background rounded-lg p-3 text-center">
            <div className="text-sm font-bold text-green-400">{bookings.filter(b => b.status === 'confirmed').length}</div>
            <div className="text-xs text-muted-foreground">Confirmed</div>
          </div>
          <div className="bg-background rounded-lg p-3 text-center">
            <div className="text-sm font-bold text-yellow-400">{bookings.filter(b => b.status === 'pending').length}</div>
            <div className="text-xs text-muted-foreground">Pending (blocks dates)</div>
          </div>
          <div className="bg-background rounded-lg p-3 text-center">
            <div className="text-sm font-bold text-blue-400">{bookings.filter(b => b.status === 'completed').length}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="bg-background rounded-lg p-3 text-center">
            <div className="text-sm font-bold text-red-400">{bookings.filter(b => b.status === 'cancelled').length}</div>
            <div className="text-xs text-muted-foreground">Cancelled (dates freed)</div>
          </div>
        </div>
      </div>
    </main>
  )
}
