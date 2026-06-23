import { NextResponse } from 'next/server'
import { getBookingById, updateBookingStatus, deleteBooking } from '@/lib/store'
import { BookingStatus } from '@/types'

const ADMIN_KEY = 'ayp2024'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const booking = getBookingById(id)
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }
  return NextResponse.json(booking)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  if (searchParams.get('key') !== ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { status } = await request.json()
  const booking = updateBookingStatus(id, status as BookingStatus)
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }
  return NextResponse.json(booking)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  if (searchParams.get('key') !== ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const success = deleteBooking(id)
  if (!success) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
