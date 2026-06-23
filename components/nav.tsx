"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Settings, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'
import { Badge } from '@/components/ui/badge'

export function Nav() {
  const pathname = usePathname()
  const { cart, isLoaded } = useCart()

  const cartCount = isLoaded ? cart.items.length : 0

  return (
    <nav className="sticky top-0 z-50 border-b border-orange-500/20 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-black font-black text-sm">
              AYP
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-white text-sm leading-none block">AYP Services</span>
              <span className="text-orange-400 text-xs leading-none">Equipment Rental</span>
            </div>
          </Link>

          {/* Center Nav */}
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                pathname === '/'
                  ? 'bg-orange-500/20 text-orange-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Equipment</span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              href="/checkout"
              className={cn(
                'relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                pathname === '/checkout'
                  ? 'bg-orange-500 text-black'
                  : 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/30'
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 bg-orange-500 text-black text-xs font-bold rounded-full border-0">
                  {cartCount}
                </Badge>
              )}
            </Link>

            <Link
              href="/admin"
              className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
              title="Admin"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
