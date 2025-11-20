import { metadata } from '@/config/constant'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import RootLayoutClient from './layout-client'

export { metadata }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="font-ye-font">
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
