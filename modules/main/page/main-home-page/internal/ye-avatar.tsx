'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import avatar from '@/config/img/avatar.webp'
import { useTransitionTheme } from '@/hooks/use-transition-theme'

export default function YeAvatar() {
  const { setTransitionTheme, theme } = useTransitionTheme()

  return (
    <motion.figure className="relative mx-auto flex w-full max-w-[270px] flex-col items-center gap-4">
      <div className="absolute inset-[18px] rounded-[38px] border border-[#57b8ab]/35 bg-[#def2ed]/80 shadow-[0_20px_50px_-36px_rgba(87,184,171,0.75)] rotate-6 dark:border-[#4f8e85]/28 dark:bg-[#143136]/70" />
      <motion.div
        className="relative w-full cursor-grab rounded-[38px] border border-white/80 bg-white/76 p-4 shadow-[0_28px_80px_-42px_rgba(41,66,69,0.56)] backdrop-blur-xl active:cursor-grabbing dark:border-white/12 dark:bg-white/[0.05] dark:shadow-[0_28px_80px_-42px_rgba(0,0,0,0.95)]"
        onDoubleClick={() =>
          setTransitionTheme(theme === 'light' ? 'dark' : 'light')}
        whileTap={{ scale: 0.99, rotate: 1 }}
        drag
        dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
        dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
        dragElastic={0.2}
      >
        <div className="relative overflow-hidden rounded-[28px] border border-black/5 bg-[radial-gradient(circle_at_top,_rgba(87,184,171,0.24),_transparent_56%),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(238,245,242,0.88))] p-3 dark:border-white/10 dark:bg-[radial-gradient(circle_at_top,_rgba(87,184,171,0.28),_transparent_56%),linear-gradient(180deg,rgba(30,48,51,0.96),rgba(15,24,27,0.92))]">
          <Image
            src={avatar}
            alt="avatar"
            className="w-full rounded-[24px]"
            placeholder="blur"
            priority
          />
          <span
            className="absolute inset-3 rounded-[24px]
                    ring-2 dark:ring-[3px]
                  ring-[#57b8ab] dark:ring-[#5d9b92]
                    ring-offset-1 animate-ye-ping-one-dot-one"
          />
        </div>
      </motion.div>

      <figcaption className="paper-label !tracking-[0.18em]">drag / double click</figcaption>
    </motion.figure>
  )
}
