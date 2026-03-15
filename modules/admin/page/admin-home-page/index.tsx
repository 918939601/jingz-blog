import * as motion from 'motion/react-client'
import {
  getRemainingDaysOfYear,
  getTodayDayInfo,
  getYearProgress,
} from '@/lib/time'
import Greeting from './internal/greeting'

export default function AdminHomePage() {
  const { year, dayOfYear } = getTodayDayInfo()
  const progress = getYearProgress().passed
  const remainingDays = getRemainingDaysOfYear()

  return (
    <motion.main
      className="m-auto flex w-full max-w-6xl flex-col gap-6"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 20,
      }}
    >
      <section className="paper-card-strong grid gap-6 p-6 md:grid-cols-[minmax(0,1.2fr)_320px] md:p-8">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="paper-label">admin</span>
            <span className="paper-label !tracking-[0.18em]">content system</span>
          </div>
          <h1 className="paper-title mt-5 text-4xl leading-tight md:text-5xl">
            <Greeting />
            ，后台工作台
          </h1>
          <div className="mt-4 space-y-3 text-sm leading-7 text-foreground/68 md:text-base">
            <p>
              今天是
              {year}
              {' '}
              年的第
              {dayOfYear}
              {' '}
              天。
            </p>
            <p>这里负责文章、笔记、标签和引用的整理发布，前台的风格也同步延伸到了这里。</p>
          </div>
        </div>

        <div className="paper-card flex flex-col justify-between p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-foreground/42">Year Progress</p>
            <p className="paper-title mt-3 text-4xl">{`${progress}%`}</p>
          </div>
          <div className="mt-6 space-y-2 text-sm text-foreground/58">
            <p>{`距离今年结束还有 ${remainingDays} 天`}</p>
            <p>活着开心最重要，但也别完全不更新。</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="paper-card p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-foreground/42">Today</p>
          <p className="paper-title mt-3 text-3xl">{dayOfYear}</p>
          <p className="mt-2 text-sm text-foreground/56">当前年度序号</p>
        </div>
        <div className="paper-card p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-foreground/42">Progress</p>
          <p className="paper-title mt-3 text-3xl">{`${progress}%`}</p>
          <p className="mt-2 text-sm text-foreground/56">已走过的年度进度</p>
        </div>
        <div className="paper-card p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-foreground/42">Reminder</p>
          <p className="mt-3 text-sm leading-7 text-foreground/64">保持更新频率，但不要为了更新而更新。</p>
        </div>
      </section>
    </motion.main>
  )
}
