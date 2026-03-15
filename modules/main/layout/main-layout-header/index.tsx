'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, useRef } from 'react'
import MaxWidthWrapper from '@/components/shared/max-width-wrapper'
import { useIndicatorPosition } from '@/hooks/use-indicator-position'
import { getActiveMainPath } from '@/lib/url'
import { cn } from '@/lib/utils'

const RouteList = [
  {
    path: '/',
    pathName: '首页',
  },
  {
    path: '/blog',
    pathName: '博客',
  },
  {
    path: '/note',
    pathName: '笔记',
  },
  {
    path: '/about',
    pathName: '关于',
  },
] as const

export default function MainLayoutHeader() {
  const pathname = usePathname()
  const activeUrl = getActiveMainPath(pathname)
  const refs = useRef(new Map<string, HTMLAnchorElement>())

  const indicatorStyle = useIndicatorPosition(activeUrl, refs)

  return (
    <header className="sticky top-0 z-30 px-4 pt-4">
      <MaxWidthWrapper className="max-w-6xl">
        <div className="paper-card-strong flex items-center justify-between gap-3 rounded-full px-3 py-2 md:px-4">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 rounded-full px-3 py-2"
          >
            <span className="paper-label !px-2.5 !py-1 !tracking-[0.22em]">JING</span>
            <div className="hidden min-w-0 sm:block">
              <p className="paper-title truncate text-base md:text-lg">blog / notes / fragments</p>
            </div>
          </Link>

          <nav className="relative flex rounded-full bg-black/[0.035] p-1 dark:bg-white/[0.04]">
            <motion.div
              className="absolute inset-y-1 rounded-full bg-white/92 shadow-[0_10px_25px_-18px_rgba(41,66,69,0.8)] dark:bg-[#173135]"
              animate={indicatorStyle}
              transition={{
                type: 'spring',
                stiffness: 180,
                damping: 22,
              }}
            />
            {RouteList.map(route => (
              <Fragment key={route.path}>
                <Link
                  href={route.path}
                  ref={(el) => {
                    if (el)
                      refs.current.set(route.path, el)
                  }}
                  className={cn(
                    'relative z-10 rounded-full px-3 py-2 text-sm transition-colors md:px-5 md:text-[15px]',
                    route.path === activeUrl
                      ? 'font-semibold text-primary dark:text-primary'
                      : 'text-foreground/62 hover:text-foreground dark:text-white/60 dark:hover:text-white/88',
                  )}
                >
                  <h2>{route.pathName}</h2>
                </Link>
              </Fragment>
            ))}
          </nav>
        </div>
      </MaxWidthWrapper>
    </header>
  )
}
