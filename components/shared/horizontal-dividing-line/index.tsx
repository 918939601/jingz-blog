'use client'

import Mandala from '@/config/svg/mandala'
import { useTransitionTheme } from '@/hooks/use-transition-theme'
import { motion, useAnimationFrame, useMotionValue } from 'motion/react'
import { useState } from 'react'

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
    <div className="relative w-full flex items-center justify-center">
      <hr className="absolute w-[45%] left-0 dark:border-accent border-indigo-500 border-dashed" />
      <motion.div
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
      <hr className="absolute w-[45%] right-0 dark:border-accent border-indigo-500 border-dashed" />
    </div>
  )
}
