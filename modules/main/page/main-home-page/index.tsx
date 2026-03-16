import * as motion from 'motion/react-client'
import { Suspense } from 'react'
import { WeatherWidget } from '@/components/shared/weather-widget'
import { fetchPublishedEchos } from '@/lib/api/echo'
import BioSection from './internal/bio-section'
import EchoCard from './internal/echo-card'
import LiveClockCard from './internal/live-clock-card'
import MusicCard from './internal/music-card'
import TechStack from './internal/tech-stack'
import YeAvatar from './internal/ye-avatar'

// 天气组件加载中的占位符
function WeatherWidgetSkeleton() {
  return (
    <div className="paper-card h-[260px] w-full animate-pulse" />
  )
}

export default async function MainLayoutContainer() {
  let allPublishedEcho: Array<{
    id: number
    reference: string
    content: string
    isPublished: boolean
    createdAt: Date
  }> = []

  try {
    allPublishedEcho = (await fetchPublishedEchos())
      .map(e => ({ ...e, createdAt: new Date(e.createdAt) }))
  }
  catch (error) {
    console.error('Failed to load published echos for home page:', error)
  }

  return (
    <div className="relative">
      <motion.main
        className="mx-auto flex w-full max-w-6xl flex-col gap-6 overflow-hidden py-2 md:gap-8"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: [-10, 0] }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
        }}
      >
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_320px] xl:items-stretch">
          <div className="paper-card relative overflow-hidden px-5 py-6 md:px-8 md:py-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(87,184,171,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(141,170,211,0.12),_transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(87,184,171,0.14),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(141,170,211,0.08),_transparent_28%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-center">
              <YeAvatar />
              <BioSection />
            </div>
          </div>

          <aside className="flex h-full flex-col gap-6 xl:sticky xl:top-28">
            <Suspense fallback={<WeatherWidgetSkeleton />}>
              <WeatherWidget />
            </Suspense>
            <LiveClockCard />
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-stretch">
          <div className="flex h-full flex-col gap-6">
            <EchoCard allPublishedEcho={allPublishedEcho} />
            <MusicCard />
          </div>
          <div className="paper-card flex h-full min-h-full self-stretch p-6 md:p-8">
            <TechStack />
          </div>
        </section>
      </motion.main>
    </div>
  )
}
