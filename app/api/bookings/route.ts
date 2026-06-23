import { NextResponse } from 'next/server'
import { getAllBookings, createBooking, checkMultipleAvailability } from '@/lib/store'
import { getEquipmentById } from '@/lib/equipment-data'

const ADMIN_KEY = 'ayp2024'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('key') !== ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(getAllBookings())
}

export async function POST(request: Request) {
  const body = await request.json()
  const { equipmentIds, customerName, customerEmail, customerPhone, eventName, eventDate, returnDate, notes } = body

  if (!equipmentIds?.length || !customerName || !customerEmail || !eventDate || !returnDate) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Validate dates
  const start = new Date(eventDate)
  const end = new Date(returnDate)
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return NextResponse.json({ error: 'Invalid dates' }, { status: 400 })
  }
  if (end < start) {
    return NextResponse.json({ error: 'Return date must be on or after event date' }, { status: 400 })
  }

  // Check availability for all requested items
  const availabilityChecks = checkMultipleAvailability(equipmentIds, eventDate, returnDate)
  const unavailable = availabilityChecks.filter(c => !c.available)

  if (unavailable.length > 0) {
    const unavailableNames = unavailable.map(u => getEquipmentById(u.equipmentId)?.name || u.equipmentId)
    return NextResponse.json({
      error: 'Some equipment is not available for these dates',
      unavailableItems: unavailableNames
    }, { status: 409 })
  }

  // Calculate days (inclusive)
  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1)

  const items = equipmentIds.map((id: string) => {
    const equipment = getEquipmentById(id)
    if (!equipment) throw new Error(`Equipment not found: ${id}`)
    return { equipmentId: id, name: equipment.name, dailyRate: equipment.dailyRate }
  })

  const totalAmount = items.reduce((sum: number, item: { dailyRate: number }) => sum + item.dailyRate * days, 0)

  const booking = createBooking({
    items,
    customerName,
    customerEmail,
    customerPhone: customerPhone || '',
    eventName: eventName || 'My Event',
    eventDate,
    returnDate,
    days,
    totalAmount,
    notes: notes || ''
  })

  return NextResponse.json(booking, { status: 201 })
}
