'use client'

import { useEffect, useRef, useState } from 'react'

const TIME_ZONE = 'Asia/Shanghai'
const LOCALE = 'zh-CN'

interface ClockSnapshot {
  time: string
  hour: number
  weekday: string
  fullDate: string
  hourAngle: number
  minuteAngle: number
  secondAngle: number
}

const formatter = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  hour12: false,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  weekday: 'long',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

function getGreeting(hour: number) {
  if (hour < 6)
    return '凌晨模式'
  if (hour < 9)
    return '早上好'
  if (hour < 12)
    return '上午进行中'
  if (hour < 14)
    return '中午歇一会'
  if (hour < 18)
    return '下午继续写'
  return '晚上也别停'
}

function createClockSnapshot(now: Date): ClockSnapshot {
  const parts = formatter.formatToParts(now)
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find(part => part.type === type)?.value ?? ''

  const year = Number(pick('year'))
  const month = Number(pick('month'))
  const day = Number(pick('day'))
  const hour = Number(pick('hour'))
  const minute = Number(pick('minute'))
  const second = Number(pick('second'))
  const weekday = pick('weekday')
  const millisecond = now.getMilliseconds()
  const secondProgress = second + millisecond / 1000
  const minuteProgress = minute + secondProgress / 60
  const hourProgress = (hour % 12) + minuteProgress / 60

  return {
    time: `${pick('hour')}:${pick('minute')}:${pick('second')}`,
    hour,
    weekday,
    fullDate: `${year}年${month}月${day}日`,
    hourAngle: hourProgress * 30,
    minuteAngle: minuteProgress * 6,
    secondAngle: secondProgress * 6,
  }
}

export default function LiveClockCard() {
  const [clock, setClock] = useState<ClockSnapshot | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const tick = () => {
      setClock(createClockSnapshot(new Date()))
      rafRef.current = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      if (rafRef.current !== null)
        cancelAnimationFrame(rafRef.current)
    }
  }, [])

  if (!clock) {
    return <div className="paper-card h-[360px] w-full animate-pulse" />
  }

  return (
    <section className="paper-card relative flex min-h-[360px] flex-1 overflow-hidden p-5 md:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(87,184,171,0.18),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(141,170,211,0.12),_transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(87,184,171,0.14),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(141,170,211,0.08),_transparent_28%)]" />

      <div className="relative flex h-full w-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="paper-label">live clock</span>
            <p className="mt-3 text-sm text-foreground/62">{getGreeting(clock.hour)}</p>
          </div>
          <div className="rounded-full border border-white/80 bg-white/80 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-foreground/48 dark:border-white/12 dark:bg-white/[0.06]">
            {TIME_ZONE}
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="mt-6 flex justify-center">
            <div className="relative flex size-[220px] items-center justify-center rounded-full border border-white/80 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.96),rgba(238,244,241,0.82)_55%,rgba(213,228,224,0.9))] shadow-[0_24px_60px_-42px_rgba(41,66,69,0.8)] dark:border-white/12 dark:bg-[radial-gradient(circle_at_30%_30%,rgba(36,53,56,0.98),rgba(21,31,34,0.95)_58%,rgba(10,16,19,0.98))] dark:shadow-[0_24px_60px_-40px_rgba(0,0,0,0.92)]">
              <div className="absolute inset-[12px] rounded-full border border-dashed border-black/8 dark:border-white/10" />
              {Array.from({ length: 12 }).map((_, index) => {
                const angle = index * 30
                const isMajor = index % 3 === 0

                return (
                  <span
                    key={angle}
                    className="absolute left-1/2 top-1/2 block origin-center"
                    style={{ transform: `translate(-50%, -50%) rotate(${angle}deg)` }}
                  >
                    <span
                      className={isMajor
                        ? 'block h-5 w-[3px] rounded-full bg-foreground/70'
                        : 'block h-3.5 w-[2px] rounded-full bg-foreground/30'}
                      style={{ transform: 'translateY(-88px)' }}
                    />
                  </span>
                )
              })}

              <span
                className="absolute left-1/2 top-1/2 h-[58px] w-[6px] origin-bottom rounded-full bg-foreground shadow-[0_0_18px_rgba(0,0,0,0.08)]"
                style={{ transform: `translate(-50%, -100%) rotate(${clock.hourAngle}deg)` }}
              />
              <span
                className="absolute left-1/2 top-1/2 h-[78px] w-[4px] origin-bottom rounded-full bg-[#57b8ab] shadow-[0_0_22px_rgba(87,184,171,0.35)]"
                style={{ transform: `translate(-50%, -100%) rotate(${clock.minuteAngle}deg)` }}
              />
              <span
                className="absolute left-1/2 top-1/2 h-[88px] w-[2px] origin-bottom rounded-full bg-[#d36f5d] shadow-[0_0_20px_rgba(211,111,93,0.28)]"
                style={{ transform: `translate(-50%, -100%) rotate(${clock.secondAngle}deg)` }}
              />
              <span className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-foreground dark:border-white/25" />
            </div>
          </div>

          <div className="mt-6 text-center">
            <p suppressHydrationWarning className="paper-title text-[2rem] leading-none tabular-nums">
              {clock.time}
            </p>
            <div suppressHydrationWarning className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm text-foreground/62">
              <span>{clock.fullDate}</span>
              <span>{clock.weekday}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
