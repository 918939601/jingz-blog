'use client'

import { motion, useScroll } from 'motion/react'

export default function ScrollIndicator({
  backgroundColor = '#57b8ab',
}: {
  backgroundColor?: string
}) {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      style={{
        scaleX: scrollYProgress,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        originX: 0,
        backgroundColor,
        zIndex: 40,
        boxShadow: '0 0 18px rgba(87, 184, 171, 0.45)',
      }}
    />
  )
}
