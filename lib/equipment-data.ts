import { Equipment } from '@/types'

export const EQUIPMENT: Equipment[] = [
  {
    id: 'dj-gear',
    name: 'DJ Gear Package',
    slug: 'dj-gear',
    category: 'audio',
    description: 'Professional DJ setup including CDJ players, mixer, and all cables. Perfect for weddings, corporate events, and parties.',
    dailyRate: 350,
    emoji: '🎧',
    features: ['Pioneer CDJ-3000 Players', 'Pioneer DJM-900NXS2 Mixer', 'All cables included', 'Laptop stand', 'Setup assistance available']
  },
  {
    id: 'photobooth',
    name: 'Photo Booth',
    slug: 'photobooth',
    category: 'booth',
    description: 'Classic photo booth with instant prints, digital sharing, and a huge selection of props. Attendant included.',
    dailyRate: 650,
    emoji: '📷',
    features: ['Instant 2x6 or 4x6 prints', 'Digital sharing via text/email', 'Customizable print overlays', 'Unlimited photos', 'Prop kit included', 'Dedicated attendant']
  },
  {
    id: '360-booth',
    name: '360° Video Booth',
    slug: '360-booth',
    category: 'booth',
    description: 'Stunning 360° slow-motion video booth. Guests step on the platform while the camera rotates for epic video content.',
    dailyRate: 850,
    emoji: '🎡',
    features: ['4K slow-motion video', 'Instant social media sharing', 'LED light ring included', 'Custom overlays/branding', 'Digital delivery', 'Dedicated attendant']
  },
  {
    id: 'uplighting',
    name: 'Uplighting (Set of 8)',
    slug: 'uplighting',
    category: 'lighting',
    description: 'Transform any venue with professional LED uplighting. 8 wireless RGBW fixtures programmed to match your event colors.',
    dailyRate: 300,
    emoji: '💡',
    features: ['8 RGBW LED fixtures', 'Wireless & battery-powered', 'Full color customization', 'Remote control included', 'Covers up to 4,000 sq ft']
  },
  {
    id: 'moving-heads',
    name: 'Moving Head Lights (Pair)',
    slug: 'moving-heads',
    category: 'lighting',
    description: 'Dynamic moving head spotlights for dance floors and stage productions. Creates stunning light shows.',
    dailyRate: 400,
    emoji: '🔦',
    features: ['2 moving head fixtures', 'Pan/tilt/zoom control', 'RGBW color mixing', 'Gobos & effects', 'DMX controller included', 'Mounting clamps']
  },
  {
    id: 'qsc-speakers',
    name: 'QSC Speakers (Pair)',
    slug: 'qsc-speakers',
    category: 'audio',
    description: 'Professional QSC powered loudspeakers delivering crystal-clear sound. Ideal for events up to 500 guests.',
    dailyRate: 275,
    emoji: '🔊',
    features: ['2x QSC K12.2 powered speakers', '2000W peak power each', 'Up to 500 guests', 'Stands included', 'All cables included']
  },
  {
    id: 'qsc-subs',
    name: 'QSC Subwoofers (Pair)',
    slug: 'qsc-subs',
    category: 'audio',
    description: 'Powerful QSC powered subwoofers adding deep, full bass to any sound system. Pairs perfectly with QSC tops.',
    dailyRate: 200,
    emoji: '🔉',
    features: ['2x QSC KW181 powered subs', '1000W per sub', '18" woofer', 'Deep bass extension', 'Dolly included']
  },
  {
    id: 'das-line-arrays',
    name: 'DAS Audio Line Arrays with Subs',
    slug: 'das-line-arrays',
    category: 'audio',
    description: 'Professional DAS Audio line array system for large events, concerts, and outdoor festivals. Exceptional clarity and throw.',
    dailyRate: 600,
    emoji: '🎵',
    features: ['4x DAS line array cabinets', '2x DAS subwoofers', 'Flying hardware', 'Lake/DSP processor', 'Ideal for 1,000+ guests', 'Setup crew included']
  },
  {
    id: 'microphones',
    name: 'Wired Microphones (Set of 4)',
    slug: 'microphones',
    category: 'audio',
    description: 'Professional wired microphone package perfect for speeches, ceremonies, presentations, and karaoke.',
    dailyRate: 75,
    emoji: '🎤',
    features: ['4x Shure SM58 microphones', 'XLR cables included', 'Mic stands included', 'Perfect for speeches & ceremonies']
  },
  {
    id: 'wireless-microphones',
    name: 'Wireless Microphones (Set of 2)',
    slug: 'wireless-microphones',
    category: 'audio',
    description: 'Professional wireless mic system with 2 handheld transmitters. Great for toasts, speeches, and presentations.',
    dailyRate: 150,
    emoji: '🎙️',
    features: ['2x wireless handhelds', 'Dual-channel receiver', 'Rechargeable batteries', 'Up to 300ft range', 'Belt packs available']
  },
  {
    id: 'lighting-rig',
    name: 'Lighting Rig Package',
    slug: 'lighting-rig',
    category: 'lighting',
    description: 'Complete stage lighting rig including trussing, par cans, and wash lights. Perfect for concerts and stage productions.',
    dailyRate: 450,
    emoji: '🎪',
    features: ['20ft truss sections', 'LED par cans', 'Wash lights', 'DMX controller', 'Power distribution', 'Full setup included']
  },
  {
    id: 'karaoke-system',
    name: 'Karaoke System',
    slug: 'karaoke-system',
    category: 'av',
    description: 'Complete professional karaoke setup with massive song library, touch screen control, and everything needed for an epic karaoke night.',
    dailyRate: 325,
    emoji: '🎶',
    features: ['100,000+ song library', 'Touch screen tablet control', 'LED TV display included', '2x wireless microphones', 'Speaker system included', 'Custom scoring']
  },
  {
    id: 'stage-monitors',
    name: 'Stage Monitors (Pair)',
    slug: 'stage-monitors',
    category: 'audio',
    description: 'Professional wedge-style floor monitors allowing performers to hear themselves clearly on stage.',
    dailyRate: 125,
    emoji: '📢',
    features: ['2x floor wedge monitors', 'Powered speakers', 'XLR cables included', 'Independent mix capability', 'Ideal for bands & performers']
  },
  {
    id: 'led-video-screens',
    name: 'LED Video Screens',
    slug: 'led-video-screens',
    category: 'visual',
    description: 'High-brightness indoor LED video wall panels for large-scale event displays, live production, and digital backdrops.',
    dailyRate: 500,
    emoji: '📺',
    features: ['3.9mm pixel pitch', 'Indoor/outdoor rated', 'Seamless panel connection', 'Video processor included', 'Custom sizing available', 'Technical support']
  },
  {
    id: 'projector-screen',
    name: 'Projector & Screen',
    slug: 'projector-screen',
    category: 'visual',
    description: 'Professional HD projector with large format screen. Perfect for presentations, slideshows, and video playback.',
    dailyRate: 275,
    emoji: '🎬',
    features: ['7000 lumen HD projector', '16:9 aspect ratio', '10ft or 14ft screen', 'HDMI & wireless input', 'Screen stand included', 'All cables included']
  },
  {
    id: 'tv-stands',
    name: 'TV with Stands',
    slug: 'tv-stands',
    category: 'visual',
    description: '65" commercial-grade flat screen TV on adjustable stands. Great for menus, presentations, live video feeds, and slideshows.',
    dailyRate: 175,
    emoji: '🖥️',
    features: ['65" 4K commercial display', 'Adjustable height stand', 'HDMI & USB input', 'Perfect for menus & slideshows', 'Transport case included']
  }
]

export function getEquipmentBySlug(slug: string): Equipment | undefined {
  return EQUIPMENT.find(e => e.slug === slug)
}

export function getEquipmentById(id: string): Equipment | undefined {
  return EQUIPMENT.find(e => e.id === id)
}
