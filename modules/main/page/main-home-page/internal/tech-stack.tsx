'use client'

import type { JSX } from 'react'
import GolangSvg from '@/config/svg/golang-svg'
import NextjsSvg from '@/config/svg/nextjs-svg'
import ReactSvg from '@/config/svg/reactjs-svg'
import TailwindcssSvg from '@/config/svg/tailwindcss-svg'
import TypeScriptSvg from '@/config/svg/typescript-svg'
import VueSvg from '@/config/svg/vuejs-svg'
import {
  startConfettiGinkgo,
  startConfettiSakura,
} from '@/lib/animation/particle-effects'
import { cn } from '@/lib/utils'
import { ArrowDown } from 'lucide-react'
import { useState } from 'react'

const techStackSvg: JSX.Element[] = [
  <VueSvg key="vue" />,
  <TypeScriptSvg key="ts" />,
  <ReactSvg key="react" />,
  <TailwindcssSvg key="tailwindcss" />,
  <NextjsSvg key="next" />,
  <GolangSvg key="go" />,
]

// * 按照上面 techStackSvg 的顺序开始点亮
const correctOrder = [0, 1, 2, 3, 4, 5]

function TechStack() {
  const [clicked, setClicked] = useState<boolean[]>(
    Array.from({ length: techStackSvg.length }, () => false),
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
    <div>
      <ArrowDown height={100} width={40} className="animate-bounce mx-auto" />
      {/* 尺子量的~ */}
      <section className="relative size-[250px] md:size-[500px] rounded-full animate-ye-spin-slowly">
        {techStackSvg.map((svg, i) => (
          <div
            key={svg.key}
            onClick={() => handleClick(i)}
            className={cn(
              `absolute left-1/2 -translate-x-1/2 size-1/4 md:size-32 z-10 origin-[center_125px] md:origin-[center_250px]
                transition drop-shadow-[0_0_0.75rem_#211C84] dark:drop-shadow-[0_0_0.75rem_#006A71] hover:cursor-pointer`,
              clicked[i]
              && 'drop-shadow-[0_0_1.25rem_#4D55CC] dark:drop-shadow-[0_0_1.25rem_#91DDCF] brightness-125',
            )}
            style={{
              transform: `rotate(${i * (360 / techStackSvg.length)}deg)`,
            }}
          >
            {svg}
          </div>
        ))}
      </section>
    </div>
  )
}

export default TechStack
