'use client'

import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
} from 'motion/react'
import { useEffect } from 'react'
import { INITIAL_WELCOME_TEXT } from '@/config/constant'

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
          className="fixed top-2/3 left-1/2 z-50 h-screen w-[1px] -translate-x-1/2 bg-[#f5f1ea] dark:bg-[#d6e3dc]/70"
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
          className="fixed bottom-2/3 left-1/2 z-50 h-screen w-[1px] -translate-x-1/2 bg-[#f5f1ea] dark:bg-[#d6e3dc]/70"
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
          className="fixed left-1/2 top-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center leading-none text-[#57b8ab] pointer-events-none text-5xl dark:text-[#8ed2c8]"
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
        className="fixed left-0 top-0 z-40 h-screen w-1/2 bg-gradient-to-r from-[#d7ece6] to-[#edf1ea] dark:from-[#13373a] dark:to-[#081012]"
        style={{ x: toLeft }}
      />
      <motion.span
        className="fixed right-0 top-0 z-40 h-screen w-1/2 bg-gradient-to-l from-[#d7ece6] to-[#edf1ea] dark:from-[#13373a] dark:to-[#081012]"
        style={{ x: toRight }}
      />
    </>
  )
}
