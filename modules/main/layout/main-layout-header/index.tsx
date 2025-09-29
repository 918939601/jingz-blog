'use client'

import MaxWidthWrapper from '@/components/shared/max-width-wrapper'
import { useIndicatorPosition } from '@/hooks/use-indicator-position'
import { getActiveMainPath } from '@/lib/url'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, useRef } from 'react'

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
    <header
      className="h-14 flex items-center justify-center sticky top-0 backdrop-blur-lg z-20
                border-b border-dashed dark:border-b-accent border-b-indigo-200"
    >
      <MaxWidthWrapper className="flex items-center justify-center">
        <nav className="relative flex md:gap-16 gap-8">
          {RouteList.map(route => (
            <Fragment key={route.path}>
              <Link
                href={route.path}
                ref={(el) => {
                  if (el)
                    refs.current.set(route.path, el)
                }}
                className={cn(
                  'relative md:text-xl px-4',
                  route.path === activeUrl
                  && 'text-purple-600 dark:text-emerald-300 font-bold',
                )}
              >
                <h2>{route.pathName}</h2>
              </Link>
            </Fragment>
          ))}

          {/* 指示条 */}
          <motion.div
            className="absolute bottom-0 h-[2px] bg-purple-600 dark:bg-emerald-300 rounded-full"
            animate={indicatorStyle}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 16,
            }}
          />
        </nav>
      </MaxWidthWrapper>
    </header>
  )
}
