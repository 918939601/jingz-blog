'use client'

import { Code } from 'lucide-react'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

function AdminLogo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            className="flex items-center gap-3 rounded-full px-3 py-2"
            href="/"
          >
            <span className="paper-label !px-2.5 !py-1 !tracking-[0.22em]">CMS</span>
            <div className="hidden sm:block">
              <h2 className="paper-title text-base">叶鱼后台管理</h2>
            </div>
            <Code size={18} className="text-foreground/45" />
          </Link>
        </TooltipTrigger>
        <TooltipContent>点击返回前台</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default AdminLogo
