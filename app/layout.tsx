import type { Metadata, Viewport } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const merriweather = Merriweather({ subsets: ['latin'], weight: ['300', '400', '700', '900'], variable: '--font-serif' })

export const metadata: Metadata = {
  title: {
    default: 'NTR Properties - North Town Residency Karachi',
    template: '%s | NTR Properties',
  },
  description: 'Buy, sell, and rent properties in North Town Residency Karachi. Find residential plots, commercial shops in Phase 1, 2, and 4.',
  keywords: ['North Town Residency', 'Karachi property', 'plots for sale', 'commercial shops', 'NTR Karachi', 'real estate'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NTR Properties',
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    siteName: 'NTR Properties',
    title: 'NTR Properties - North Town Residency Karachi',
    description: 'Buy, sell, and rent properties in North Town Residency Karachi',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b5998' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground scroll-smooth" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
