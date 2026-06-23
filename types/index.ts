export type EquipmentCategory = 'audio' | 'visual' | 'lighting' | 'booth' | 'av'
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Equipment {
  id: string
  name: string
  slug: string
  category: EquipmentCategory
  description: string
  dailyRate: number
  features: string[]
  emoji: string
}

export interface BookingItem {
  equipmentId: string
  name: string
  dailyRate: number
}

export interface Booking {
  id: string
  items: BookingItem[]
  customerName: string
  customerEmail: string
  customerPhone: string
  eventName: string
  eventDate: string
  returnDate: string
  days: number
  totalAmount: number
  status: BookingStatus
  notes: string
  createdAt: string
}

export interface CartItem {
  equipmentId: string
  name: string
  dailyRate: number
  category: EquipmentCategory
  slug: string
}
