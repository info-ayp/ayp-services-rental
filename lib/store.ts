import { Booking, BookingStatus } from '@/types'

declare global {
  // eslint-disable-next-line no-var
  var __bookingStore: Booking[] | undefined
}

if (!global.__bookingStore) {
  // Seed with sample bookings so admin isn't empty on first load
  const now = new Date()
  const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1)
  const next5 = new Date(now); next5.setDate(now.getDate() + 5)
  const next10 = new Date(now); next10.setDate(now.getDate() + 10)
  const next12 = new Date(now); next12.setDate(now.getDate() + 12)

  global.__bookingStore = [
    {
      id: 'AYP-SAMPLE-001',
      items: [
        { equipmentId: 'dj-gear', name: 'DJ Gear Package', dailyRate: 350 },
        { equipmentId: 'qsc-speakers', name: 'QSC Speakers (Pair)', dailyRate: 275 },
        { equipmentId: 'uplighting', name: 'Uplighting (Set of 8)', dailyRate: 300 }
      ],
      customerName: 'Sarah Martinez',
      customerEmail: 'sarah@example.com',
      customerPhone: '(561) 555-0101',
      eventName: 'Martinez Wedding Reception',
      eventDate: next5.toISOString().split('T')[0],
      returnDate: next5.toISOString().split('T')[0],
      days: 1,
      totalAmount: 925,
      status: 'confirmed',
      notes: 'Setup at 4pm, event starts 7pm',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'AYP-SAMPLE-002',
      items: [
        { equipmentId: 'photobooth', name: 'Photo Booth', dailyRate: 650 },
        { equipmentId: '360-booth', name: '360° Video Booth', dailyRate: 850 }
      ],
      customerName: 'Johnson & Associates',
      customerEmail: 'events@johnson.com',
      customerPhone: '(561) 555-0202',
      eventName: 'Corporate Holiday Party',
      eventDate: next10.toISOString().split('T')[0],
      returnDate: next10.toISOString().split('T')[0],
      days: 1,
      totalAmount: 1500,
      status: 'pending',
      notes: 'Needs setup by 5pm',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
}

function getStore(): Booking[] {
  return global.__bookingStore!
}

export function getAllBookings(): Booking[] {
  return [...getStore()].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getBookingById(id: string): Booking | undefined {
  return getStore().find(b => b.id === id)
}

export function createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking {
  const random = Math.random().toString(36).slice(2, 6).toUpperCase()
  const newBooking: Booking = {
    ...booking,
    id: `AYP-${Date.now()}-${random}`,
    status: 'pending',
    createdAt: new Date().toISOString()
  }
  getStore().push(newBooking)
  return newBooking
}

export function updateBookingStatus(id: string, status: BookingStatus): Booking | null {
  const booking = getStore().find(b => b.id === id)
  if (!booking) return null
  booking.status = status
  return booking
}

export function deleteBooking(id: string): boolean {
  const index = getStore().findIndex(b => b.id === id)
  if (index === -1) return false
  getStore().splice(index, 1)
  return true
}

export function isEquipmentAvailable(equipmentId: string, eventDate: string, returnDate: string): boolean {
  const start = new Date(eventDate)
  const end = new Date(returnDate)

  const conflicting = getStore().filter(booking => {
    if (booking.status === 'cancelled') return false
    if (!booking.items.some(item => item.equipmentId === equipmentId)) return false
    const bookingStart = new Date(booking.eventDate)
    const bookingEnd = new Date(booking.returnDate)
    return start <= bookingEnd && end >= bookingStart
  })

  return conflicting.length === 0
}

export function getBookedDateRanges(equipmentId: string): { start: string; end: string; bookingId: string }[] {
  return getStore()
    .filter(b => b.status !== 'cancelled' && b.items.some(item => item.equipmentId === equipmentId))
    .map(b => ({ start: b.eventDate, end: b.returnDate, bookingId: b.id }))
}

export function checkMultipleAvailability(
  equipmentIds: string[],
  eventDate: string,
  returnDate: string
): { equipmentId: string; available: boolean }[] {
  return equipmentIds.map(id => ({
    equipmentId: id,
    available: isEquipmentAvailable(id, eventDate, returnDate)
  }))
}
