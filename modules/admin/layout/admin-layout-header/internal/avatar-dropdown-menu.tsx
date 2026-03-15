'use client'

import { LogOut } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import YeYuAvatar from '@/components/shared/yeyu-avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function AvatarDropdownMenu() {
  const { data: session } = useSession()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center rounded-full border border-white/80 bg-white/82 p-1 dark:border-white/12 dark:bg-white/[0.06]">
        <YeYuAvatar />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-[22px] border-white/80 bg-white/92 p-2 backdrop-blur-xl dark:border-white/12 dark:bg-[#111a1d]/92">
        <DropdownMenuLabel className="flex items-center gap-3 rounded-[18px] p-2">
          <YeYuAvatar />
          <section>
            <h3 className="font-mono text-sm">
              {session?.user?.name || 'example'}
            </h3>
            <small className="font-thin text-foreground/52">
              {session?.user?.email || 'example@gmail.com'}
            </small>
          </section>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer rounded-[14px]"
          onClick={() => {
            signOut()
          }}
        >
          <LogOut />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AvatarDropdownMenu
