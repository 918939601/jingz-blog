'use client'

import { useState } from 'react'
import GolangSvg from '@/config/svg/golang-svg'
import JavaSvg from '@/config/svg/java-svg'
import NextjsSvg from '@/config/svg/nextjs-svg'
import NodejsSvg from '@/config/svg/nodejs-svg'
import NuxtSvg from '@/config/svg/nuxt-svg'
import PhpSvg from '@/config/svg/php-svg'
import PythonSvg from '@/config/svg/python-svg'
import ReactSvg from '@/config/svg/reactjs-svg'
import TypeScriptSvg from '@/config/svg/typescript-svg'
import VueSvg from '@/config/svg/vuejs-svg'
import {
  startConfettiGinkgo,
  startConfettiSakura,
} from '@/lib/animation/particle-effects'
import { cn } from '@/lib/utils'

const techStacks = [
  { key: 'vue', label: 'Vue', icon: <VueSvg /> },
  { key: 'ts', label: 'TypeScript', icon: <TypeScriptSvg /> },
  { key: 'react', label: 'React', icon: <ReactSvg /> },
  { key: 'nuxt', label: 'Nuxt', icon: <NuxtSvg /> },
  { key: 'next', label: 'Next.js', icon: <NextjsSvg /> },
  { key: 'go', label: 'Go', icon: <GolangSvg /> },
  { key: 'java', label: 'Java', icon: <JavaSvg /> },
  { key: 'python', label: 'Python', icon: <PythonSvg /> },
  { key: 'node', label: 'Node.js', icon: <NodejsSvg /> },
  { key: 'php', label: 'PHP', icon: <PhpSvg /> },
]

// * 按照上面 techStacks 的顺序开始点亮
const correctOrder = techStacks.map((_, index) => index)

function TechStack() {
  const [clicked, setClicked] = useState<boolean[]>(
    Array.from({ length: techStacks.length }, () => false),
  )
  const [clickOrder, setClickOrder] = useState<number[]>([])

  const handleClick = (index: number) => {
    // * 已经点过了，取消点击
    if (clicked[index]) {
      const newClicked = [...clicked]
      newClicked[index] = false
      setClicked(newClicked)

      setClickOrder(prev => prev.filter(i => i !== index))
      return
    }

    // * 新点击
    const newClicked = [...clicked]
    newClicked[index] = true
    setClicked(newClicked)

    setClickOrder(prev => [...prev, index])

    const allClicked = newClicked.every(Boolean)
    if (allClicked) {
      const isCorrect
        = clickOrder.length + 1 === correctOrder.length
          && [...clickOrder, index].every((val, i) => val === correctOrder[i])

      if (isCorrect) {
        startConfettiSakura(10000)
      }
      else {
        startConfettiGinkgo(10000)
      }
    }
  }

  return (
    <section className="flex h-full flex-1 flex-col justify-between gap-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="paper-label">stack lab</span>
          <span className="text-xs uppercase tracking-[0.22em] text-foreground/42">tap in order for a hidden effect</span>
        </div>
        <h2 className="paper-title text-3xl md:text-4xl">常用技术栈</h2>
        <p className="max-w-2xl text-sm leading-7 text-foreground/68 md:text-base">
          有点幼稚但还挺有记忆点的小交互。图标会按环形缓慢旋转，都点亮会触发小彩蛋哦。
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
        <div className="grid gap-3 sm:grid-cols-2">
          {techStacks.map(({ label }, i) => (
            <div
              key={label}
              className={cn(
                'rounded-[22px] border border-black/6 bg-black/[0.03] px-4 py-4 transition-colors dark:border-white/10 dark:bg-white/[0.03]',
                clicked[i] && 'border-[#57b8ab]/55 bg-[#57b8ab]/10 dark:bg-[#57b8ab]/12',
              )}
            >
              <p className="text-xs uppercase tracking-[0.24em] text-foreground/42">
                {`0${i + 1}`}
              </p>
              <p className="mt-2 text-base font-semibold text-foreground">{label}</p>
            </div>
          ))}
        </div>

        <div className="relative mx-auto flex w-full max-w-[320px] items-center justify-center rounded-[32px] border border-white/75 bg-[radial-gradient(circle_at_center,_rgba(87,184,171,0.22),_transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.78),rgba(241,245,242,0.68))] p-8 shadow-[0_24px_70px_-40px_rgba(41,66,69,0.5)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_center,_rgba(87,184,171,0.16),_transparent_55%),linear-gradient(180deg,rgba(22,33,35,0.9),rgba(12,18,21,0.88))] dark:shadow-[0_24px_70px_-40px_rgba(0,0,0,0.85)]">
          <div className="pointer-events-none absolute inset-4 rounded-full border border-dashed border-black/10 dark:border-white/10" />
          <section className="relative size-[220px] animate-ye-spin-slowly rounded-full md:size-[260px]">
            {techStacks.map(({ key, icon }, i) => (
              <div
                key={key}
                onClick={() => handleClick(i)}
                className={cn(
                  `absolute left-1/2 top-0 z-10 size-11 -translate-x-1/2 origin-[center_110px]
                    cursor-pointer transition duration-300 md:size-12 md:origin-[center_130px]
                    drop-shadow-[0_12px_24px_rgba(41,66,69,0.18)] dark:drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)]`,
                  clicked[i] && 'scale-110 brightness-110 drop-shadow-[0_0_24px_rgba(87,184,171,0.45)]',
                )}
                style={{
                  transform: `rotate(${i * (360 / techStacks.length)}deg)`,
                }}
              >
                {icon}
              </div>
            ))}
          </section>
        </div>
      </div>
    </section>
  )
}

export default TechStack
