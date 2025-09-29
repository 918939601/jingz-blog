import LenisScrollProvider from '@/components/provider/lenis-scroll-provider'
import ContactMe from '@/components/shared/contact-me'
import HorizontalDividingLine from '@/components/shared/horizontal-dividing-line'
import MaxWidthWrapper from '@/components/shared/max-width-wrapper'
import StarsBackground from '@/components/shared/stars-background'
import StartUpMotion from '@/components/shared/start-up-motion'
import MainLayoutHeader from '@/modules/main/layout/main-layout-header'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LenisScrollProvider>
      <main
        className="min-h-screen max-w-screen
                    flex flex-col justify-between gap-2
                  bg-slate-200 dark:bg-black dark:text-white
                    md:text-lg"
      >
        <MainLayoutHeader />

        <MaxWidthWrapper className="overflow-x-hidden flex flex-col justify-between flex-1 gap-2">
          <main className="flex flex-col flex-1">{children}</main>

          <HorizontalDividingLine />
          <ContactMe />
        </MaxWidthWrapper>

        <StartUpMotion />
        <StarsBackground />
      </main>
    </LenisScrollProvider>
  )
}
