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
            className="flex items-center gap-1 hover:underline"
            href="/"
          >
            <h2 className="font-bold">叶鱼后台管理</h2>
            <Code size={18} />
          </Link>
        </TooltipTrigger>
        <TooltipContent>点击返回前台</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default AdminLogo
