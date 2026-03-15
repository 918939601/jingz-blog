import LenisScrollProvider from '@/components/provider/lenis-scroll-provider'
import ContactMe from '@/components/shared/contact-me'
import HorizontalDividingLine from '@/components/shared/horizontal-dividing-line'
import MaxWidthWrapper from '@/components/shared/max-width-wrapper'
import StartUpMotion from '@/components/shared/start-up-motion'
import MainLayoutHeader from '@/modules/main/layout/main-layout-header'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LenisScrollProvider>
      <main className="relative min-h-screen overflow-hidden md:text-lg">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-8rem] top-[-5rem] size-72 rounded-full bg-[#7fd4c7]/30 blur-3xl dark:bg-[#1d5953]/24" />
          <div className="absolute right-[-6rem] top-32 size-72 rounded-full bg-[#8caad0]/22 blur-3xl dark:bg-[#294357]/26" />
          <div className="absolute bottom-0 left-1/2 h-80 w-[26rem] -translate-x-1/2 rounded-full bg-white/40 blur-3xl dark:bg-[#143036]/18" />
        </div>

        <div className="relative z-10 flex min-h-screen flex-col">
          <MainLayoutHeader />

          <MaxWidthWrapper className="flex w-11/12 max-w-6xl flex-1 flex-col gap-10 overflow-x-hidden pb-10 pt-6 md:gap-12 md:pb-12 md:pt-8">
            <main className="flex flex-1 flex-col">{children}</main>

            <section className="paper-card px-5 py-6 md:px-8 md:py-7">
              <HorizontalDividingLine fill="#57b8ab" />
              <div className="mt-6">
                <ContactMe />
              </div>
            </section>
          </MaxWidthWrapper>
        </div>

        <StartUpMotion />
      </main>
    </LenisScrollProvider>
  )
}
