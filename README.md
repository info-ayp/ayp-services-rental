# AYP Services Equipment Rental

Professional AV equipment rental booking system — Next.js app with live availability tracking, cart, checkout, and admin dashboard.

## Features
- 16 equipment items: DJ gear, photo booths, 360 booth, lighting, speakers, AV equipment
- Date-based availability (prevents double-booking automatically)
- Multi-item cart with checkout
- Unique booking IDs (AYP-XXXXX format)
- Admin dashboard — view bookings, confirm, cancel, mark complete

## Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/info-ayp/ayp-services-rental)

## Admin
Visit `/admin` — default password: `ayp2024` (change in `app/admin/page.tsx`)

## Setup
```bash
npm install
npm run dev
```

## Stack
- Next.js 15, React 19, TypeScript
- Tailwind CSS + shadcn/ui
- In-memory booking store (upgrade to Supabase/PostgreSQL for production persistence)
