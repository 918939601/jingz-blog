'use client'

import { motion, useAnimationFrame, useMotionValue } from 'motion/react'
import { useState } from 'react'
import Mandala from '@/config/svg/mandala'
import { useTransitionTheme } from '@/hooks/use-transition-theme'

// * 拖拽两边移动距离阈值，超过触发
// * 移动端拉不了多少...所以调低点，虽然会让 pc 端很容易触发
const THRESHOLD = 100

export default function HorizontalDividingLine({ fill = '#6FC3C4' }: { fill?: string }) {
  const { setTransitionTheme } = useTransitionTheme()
  const rotate = useMotionValue(0)
  const [duration, setDuration] = useState(4)

  useAnimationFrame((_, delta) => {
    rotate.set(rotate.get() + (360 * delta) / (duration * 1000))
  })

  return (
    <div className="relative flex w-full items-center justify-center">
      <span className="absolute left-0 h-px w-[42%] bg-gradient-to-r from-transparent via-[#57b8ab]/50 to-[#57b8ab]/8 dark:via-[#57b8ab]/45 dark:to-transparent" />
      <motion.div
        className="paper-card flex size-12 items-center justify-center rounded-full p-2 shadow-none"
        style={{ rotate }}
        drag="x"
        dragDirectionLock
        dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
        dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
        dragElastic={0.15}
        whileDrag={{ cursor: 'grabbing' }}
        onDragStart={() => setDuration(0.8)}
        onDragEnd={(event, info) => {
          setDuration(4)
          if (info.offset.x < -THRESHOLD) {
            setTransitionTheme('light', 'left')
          }
          else if (info.offset.x > THRESHOLD) {
            setTransitionTheme('dark', 'right')
          }
        }}
      >
        <Mandala className="size-10 cursor-grabbing" fill={fill} />
      </motion.div>
      <span className="absolute right-0 h-px w-[42%] bg-gradient-to-l from-transparent via-[#57b8ab]/50 to-[#57b8ab]/8 dark:via-[#57b8ab]/45 dark:to-transparent" />
    </div>
  )
}
