"use client"

import { useState, useEffect, useCallback } from 'react'
import { CartItem } from '@/types'

export interface CartState {
  items: CartItem[]
  eventDate: string
  returnDate: string
}

const CART_KEY = 'ayp_rental_cart'

const defaultCart: CartState = { items: [], eventDate: '', returnDate: '' }

export function useCart() {
  const [cart, setCart] = useState<CartState>(defaultCart)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY)
      if (stored) setCart(JSON.parse(stored))
    } catch {}
    setIsLoaded(true)
  }, [])

  const saveCart = useCallback((newCart: CartState) => {
    setCart(newCart)
    try { localStorage.setItem(CART_KEY, JSON.stringify(newCart)) } catch {}
  }, [])

  const addItem = useCallback((item: CartItem) => {
    setCart(prev => {
      if (prev.items.some(i => i.equipmentId === item.equipmentId)) return prev
      const newCart = { ...prev, items: [...prev.items, item] }
      try { localStorage.setItem(CART_KEY, JSON.stringify(newCart)) } catch {}
      return newCart
    })
  }, [])

  const removeItem = useCallback((equipmentId: string) => {
    setCart(prev => {
      const newCart = { ...prev, items: prev.items.filter(i => i.equipmentId !== equipmentId) }
      try { localStorage.setItem(CART_KEY, JSON.stringify(newCart)) } catch {}
      return newCart
    })
  }, [])

  const updateDates = useCallback((eventDate: string, returnDate: string) => {
    setCart(prev => {
      const newCart = { ...prev, eventDate, returnDate }
      try { localStorage.setItem(CART_KEY, JSON.stringify(newCart)) } catch {}
      return newCart
    })
  }, [])

  const clearCart = useCallback(() => {
    try { localStorage.removeItem(CART_KEY) } catch {}
    setCart(defaultCart)
  }, [])

  const isInCart = useCallback((equipmentId: string) => {
    return cart.items.some(i => i.equipmentId === equipmentId)
  }, [cart.items])

  const getDays = useCallback(() => {
    if (!cart.eventDate || !cart.returnDate) return 1
    const start = new Date(cart.eventDate)
    const end = new Date(cart.returnDate)
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1)
  }, [cart.eventDate, cart.returnDate])

  const getTotal = useCallback(() => {
    const days = getDays()
    return cart.items.reduce((sum, item) => sum + item.dailyRate * days, 0)
  }, [cart.items, getDays])

  return { cart, isLoaded, addItem, removeItem, updateDates, clearCart, isInCart, getDays, getTotal, saveCart }
}
