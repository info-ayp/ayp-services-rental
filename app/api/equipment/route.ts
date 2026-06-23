import { NextResponse } from 'next/server'
import { EQUIPMENT } from '@/lib/equipment-data'
import { isEquipmentAvailable } from '@/lib/store'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const eventDate = searchParams.get('eventDate')
  const returnDate = searchParams.get('returnDate')

  if (eventDate && returnDate) {
    const equipmentWithAvailability = EQUIPMENT.map(e => ({
      ...e,
      available: isEquipmentAvailable(e.id, eventDate, returnDate)
    }))
    return NextResponse.json(equipmentWithAvailability)
  }

  return NextResponse.json(EQUIPMENT)
}
