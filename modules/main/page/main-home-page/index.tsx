import * as motion from 'motion/react-client'
import { Suspense } from 'react'
import { fetchPublishedEchos } from '@/lib/api/echo'
import { WeatherWidget } from '@/components/shared/weather-widget'
import BioSection from './internal/bio-section'
import EchoCard from './internal/echo-card'
import TechStack from './internal/tech-stack'
import YeAvatar from './internal/ye-avatar'

// 天气组件加载中的占位符
function WeatherWidgetSkeleton() {
  return (
    <div className="w-48 h-64 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
  )
}

export default async function MainLayoutContainer() {
  const allPublishedEcho = (await fetchPublishedEchos())
  .map(e => ({ ...e, createdAt: new Date(e.createdAt) }));

  return (
    <div className="relative">
      {/* Weather Widget - Fixed on desktop, sticky on mobile */}
      <Suspense fallback={<div className="fixed right-4 top-4 z-40 hidden lg:block"><WeatherWidgetSkeleton /></div>}>
        <div className="fixed right-4 top-4 z-40 hidden lg:block">
          <WeatherWidget />
        </div>
      </Suspense>

      <motion.main
        className="flex flex-col justify-center items-center gap-6 py-4 overflow-hidden"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: [-10, 0] }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
        }}
      >
        <YeAvatar />
        <BioSection />
        <EchoCard allPublishedEcho={allPublishedEcho} />
        <TechStack />

        {/* Weather Widget - Mobile version */}
        <Suspense fallback={<div className="w-full px-4 lg:hidden"><WeatherWidgetSkeleton /></div>}>
          <div className="w-full px-4 lg:hidden">
            <WeatherWidget />
          </div>
        </Suspense>
      </motion.main>
    </div>
  )
}
