'use client'

import { INITIAL_WELCOME_TEXT } from '@/config/constant'
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
} from 'motion/react'
import { useEffect } from 'react'

export default function StartUpMotion() {
  const scaleY = useMotionValue(0)

  const toLeft = useMotionValue('0%')
  const toRight = useMotionValue('0%')

  useMotionValueEvent(scaleY, 'animationComplete', () => {
    animate(toLeft, '-100%', {
      duration: 0.8,
      ease: [0.65, 0, 0.35, 1],
      delay: 0.1,
    })

    animate(toRight, '100%', {
      duration: 0.8,
      ease: [0.65, 0, 0.35, 1],
      delay: 0.1,
    })
  })

  useEffect(() => {
    animate(scaleY, [0, 1, 0.7, 0], {
      duration: 2,
      ease: [0.65, 0, 0.35, 1],
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* 中间的白线,做两个, 先伸, 后缩 */}
      <>
        <motion.span
          className="fixed bg-white h-screen w-[1px] top-2/3 left-1/2 z-50 -translate-x-1/2"
          initial={{ scaleY: 0 }}
          style={{
            scaleY,
          }}
          transition={{
            duration: 2,
            ease: [0.65, 0, 0.35, 1],
            delay: 0.3,
          }}
        />
        <motion.span
          className="fixed bg-white h-screen w-[1px] bottom-2/3 left-1/2 z-50 -translate-x-1/2"
          initial={{ scaleY: 0 }}
          style={{
            scaleY,
          }}
          transition={{
            duration: 2,
            ease: [0.65, 0, 0.35, 1],
            delay: 0.5,
          }}
        />
        {/* 淡入淡出效果 */}
        <motion.div
          className="fixed left-1/2 top-1/2 z-50 text-purple-300 text-5xl -translate-x-1/2 -translate-y-1/2 flex flex-col items-center leading-none pointer-events-none"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [20, 0, 0, -10],
            scale: [0.95, 1, 1, 1],
          }}
          transition={{ duration: 2.4, ease: 'easeInOut' }}
        >
          {/* 文字展示 */}
          {INITIAL_WELCOME_TEXT.split('').map((char, i) => (
            <span key={`${i.toString()}+${char}`}>{char}</span>
          ))}
        </motion.div>
      </>
      {/* 两边的遮罩 */}
      <motion.span
        className="fixed w-1/2 h-screen top-0 left-0 z-40 bg-gradient-to-r from-[#22177A] to-[#000957]"
        style={{ x: toLeft }}
      />
      <motion.span
        className="fixed w-1/2 h-screen top-0 right-0 z-40 bg-gradient-to-l from-[#22177A] to-[#000957]"
        style={{ x: toRight }}
      />
    </>
  )
}
