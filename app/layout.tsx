import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/nav'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'AYP Services Equipment Rental | Palm Beach Gardens, FL',
  description: 'Professional AV equipment rental for events, weddings, corporate parties, and more. DJ gear, photo booths, lighting, speakers, and more in Palm Beach Gardens, FL.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background antialiased">
        <Nav />
        {children}
        <footer className="mt-20 border-t border-white/5 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
            <p className="font-semibold text-white mb-1">AYP Services</p>
            <p>Palm Beach Gardens, FL · Entertainment & Equipment Rental</p>
            <p className="mt-2 text-xs">30 years of entertainment industry experience</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
