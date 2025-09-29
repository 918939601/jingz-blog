'use client'

import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { getActiveAdminPath } from '@/lib/url'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
    <header
      className="sticky h-14 top-0 backdrop-blur-lg z-50 border-b border-dashed
                  flex justify-between items-center px-6"
    >
      <nav className="flex gap-4">
        {/* 左侧logo区域, 回到首页 */}
        <AdminLogo />
        {/* 路由 */}
        {AdminRoutes.map(link => (
          <Link href={link.path} key={link.path}>
            <Button
              className="rounded-lg text-base cursor-pointer"
              variant={activeUrl === link.path ? 'default' : 'ghost'}
              size="sm"
            >
              {link.pathName}
            </Button>
          </Link>
        ))}
      </nav>
      <section className="flex gap-4 items-center">
        <ModeToggle />
        <AvatarDropdownMenu />
      </section>
    </header>
  )
}

export default AdminNavbar
