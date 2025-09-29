'use client'

import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center gap-4 m-auto">
      <motion.h2
        className="text-5xl font-bold text-purple-600 dark:text-emerald-300"
        initial={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        你要找的风景，迷失在时光之外
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 0.4, duration: 0.8, ease: 'easeInOut' }}
      >
        此处，是心之所向
      </motion.p>
      <motion.div
        initial={{ opacity: 0, filter: 'blur(4px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ delay: 0.4, duration: 0.6, ease: 'easeInOut' }}
      >
        <button type="button" onClick={() => router.back()} className="text-indigo-600 dark:text-indigo-400 cursor-pointer font-bold hover:underline">
          回到过去
        </button>
      </motion.div>
    </div>
  )
}
