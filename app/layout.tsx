import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { metadata } from '@/config/constant'
import RootLayoutClient from './layout-client'
import './globals.css'

export { metadata }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isVercel = process.env.VERCEL === '1'

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="font-ye-font" suppressHydrationWarning>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
        {isVercel ? <Analytics /> : null}
        {isVercel ? <SpeedInsights /> : null}
      </body>
    </html>
  )
}
