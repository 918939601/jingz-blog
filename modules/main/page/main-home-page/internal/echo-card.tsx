'use client'

import { useEffect } from 'react'
import { useRandomEchoIndexStore } from '@/store/use-display-echo-store'

interface Echo {
  id: number
  reference: string
  content: string
  isPublished: boolean
  createdAt: Date
}

export default function EchoCard({ allPublishedEcho }: { allPublishedEcho: Echo[] }) {
  const randomIndex = useRandomEchoIndexStore(s => s.randomIndex)
  const selectRandomIndex = useRandomEchoIndexStore(s => s.selectRandomIndex)

  useEffect(() => {
    if (randomIndex === null && allPublishedEcho.length > 0)
      selectRandomIndex(allPublishedEcho.length)
  }, [allPublishedEcho.length, randomIndex, selectRandomIndex])

  const echo = allPublishedEcho[randomIndex ?? 0]

  return (
    <section className="paper-card relative overflow-hidden p-6 md:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(87,184,171,0.2),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(141,170,211,0.12),_transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(87,184,171,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(141,170,211,0.08),_transparent_28%)]" />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <span className="paper-label">today&apos;s echo</span>
          <span className="text-xs uppercase tracking-[0.22em] text-foreground/40">random line</span>
        </div>

        <p
          suppressHydrationWarning
          className="paper-title mt-8 text-2xl leading-10 text-foreground md:text-3xl md:leading-[3rem]"
        >
          「
          {echo?.content ?? '虚无。'}
          」
        </p>

        <footer
          suppressHydrationWarning
          className="mt-8 border-t border-black/8 pt-4 text-sm text-foreground/58 dark:border-white/10"
        >
          来源 /
          {' '}
          <span className="font-medium text-primary dark:text-primary">
            {echo?.reference ?? '无名。'}
          </span>
        </footer>
      </div>
    </section>
  )
}
