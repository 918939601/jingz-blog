'use client'

import { motion } from 'motion/react'

export default function Loading() {
  const animation = {
    transform: ['scale(0)', 'scale(1)'],
    opacity: [1, 0],
  }

  const transition = {
    duration: 2,
    repeat: Infinity,
    ease: 'easeOut' as const,
  }

  return (
    <div className="paper-card-strong mx-auto flex min-h-[280px] w-full max-w-2xl flex-col items-center justify-center gap-5 p-10">
      <div className="relative h-24 w-24">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#57b8ab]"
          animate={animation}
          transition={transition}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#57b8ab]/80"
          animate={animation}
          transition={{
            ...transition,
            delay: 0.45,
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#8caad0]/70"
          animate={animation}
          transition={{
            ...transition,
            delay: 0.9,
          }}
        />
        <div className="absolute inset-[26px] rounded-full bg-[#57b8ab]/16 dark:bg-[#57b8ab]/18" />
      </div>

      <div className="text-center">
        <p className="paper-title text-2xl">Loading</p>
        <p className="mt-2 text-sm text-foreground/52">正在整理内容。</p>
      </div>
    </div>
  )
}
