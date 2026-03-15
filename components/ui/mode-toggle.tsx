'use client'

import { Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'

// 动态导入主题切换逻辑，避免SSR问题
const ThemeToggleContent = dynamic(
  () => import('./theme-toggle-content').then(mod => ({ default: mod.default })),
  {
    ssr: false,
    loading: () => (
      <Button
        variant="outline"
        size="sm"
        className="glass-icon-button size-9 cursor-pointer rounded-full p-0"
      >
        <Sun />
      </Button>
    )
  }
)

export function ModeToggle() {
  return <ThemeToggleContent />
}
