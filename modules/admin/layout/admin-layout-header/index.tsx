'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { getActiveAdminPath } from '@/lib/url'
import AdminLogo from './internal/admin-logo'
import AvatarDropdownMenu from './internal/avatar-dropdown-menu'

const AdminRoutes = [
  {
    path: '/admin',
    pathName: '首页',
  },
  {
    path: '/admin/blog',
    pathName: '博客',
  },
  {
    path: '/admin/note',
    pathName: '笔记',
  },
  {
    path: '/admin/tag',
    pathName: '标签',
  },
  {
    path: '/admin/echo',
    pathName: '引用',
  },
] as const

function AdminNavbar() {
  const pathname = usePathname()
  const activeUrl = getActiveAdminPath(pathname)

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 md:px-6">
      <div className="paper-card-strong mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 rounded-[28px] px-3 py-3 md:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <AdminLogo />
          <nav className="flex flex-wrap rounded-full bg-black/[0.035] p-1 dark:bg-white/[0.04]">
            {AdminRoutes.map(link => (
              <Link
                href={link.path}
                key={link.path}
                className={`rounded-full px-3 py-2 text-sm transition-colors md:px-4 ${
                  activeUrl === link.path
                    ? 'bg-white/92 font-semibold text-primary shadow-[0_10px_25px_-18px_rgba(41,66,69,0.8)] dark:bg-[#173135]'
                    : 'text-foreground/58 hover:text-foreground dark:text-white/58 dark:hover:text-white/88'
                }`}
              >
                {link.pathName}
              </Link>
            ))}
          </nav>
        </div>

        <section className="flex items-center gap-3">
          <div className="rounded-full border border-white/80 bg-white/82 dark:border-white/12 dark:bg-white/[0.06]">
            <ModeToggle />
          </div>
          <AvatarDropdownMenu />
        </section>
      </div>
    </header>
  )
}

export default AdminNavbar
