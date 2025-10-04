import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'
import { QueryProvider } from '@/components/query-provider'

export const metadata: Metadata = {
  title: 'Domeme',
  icons: {
    icon: '/domeme.jpg'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <BackgroundRippleEffect />
        <div
          className="pointer-events-none fixed inset-x-0 bottom-0 h-full
               -z-5"
          style={{
            background: `radial-gradient(ellipse at bottom,
        rgba(6, 182, 212, 0.1),  /* cyan */
        rgba(139, 92, 246, 0.1),   /* purple */
        rgba(0, 0, 0, 0) 80%)`,
          }}
        />
        <QueryProvider>
          {children}
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  )
}
