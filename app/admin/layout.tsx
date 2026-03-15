import { SessionProvider } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { ModalProvider } from '@/components/provider/modal-provider'
import ReactQueryProvider from '@/components/provider/react-query-provider'
import { Toaster } from '@/components/ui/sonner'
import { noPermission } from '@/lib/auth'
import AdminNavbar from '@/modules/admin/layout/admin-layout-header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (await noPermission()) {
    redirect('/')
  }

  return (
    <SessionProvider>
      <ReactQueryProvider>
        <ModalProvider>
          <main className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-[-7rem] top-[-4rem] size-72 rounded-full bg-[#7fd4c7]/22 blur-3xl dark:bg-[#174846]/24" />
              <div className="absolute right-[-5rem] top-24 size-72 rounded-full bg-[#8caad0]/18 blur-3xl dark:bg-[#223d4f]/26" />
              <div className="absolute bottom-0 left-1/2 h-80 w-[28rem] -translate-x-1/2 rounded-full bg-white/30 blur-3xl dark:bg-[#112b2f]/20" />
            </div>

            <div className="relative z-10 flex min-h-screen flex-col">
              <AdminNavbar />
              <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 pb-8 pt-6 md:px-6 md:pb-10 md:pt-8">
                <main className="flex flex-1">{children}</main>
              </div>
            </div>
            <Toaster position="top-center" richColors />
          </main>
        </ModalProvider>
      </ReactQueryProvider>
    </SessionProvider>
  )
}
