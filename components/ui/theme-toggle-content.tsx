'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTransitionTheme } from '@/hooks/use-transition-theme'

export default function ThemeToggleContent() {
  const { setTransitionTheme, theme } = useTransitionTheme()

  const handleClick = () => {
    setTransitionTheme(theme === 'light' ? 'dark' : 'light', theme === 'light' ? 'bottom' : 'top')
  }

  return (
    <Button
      onClick={handleClick}
      size="sm"
      variant="outline"
      className="glass-icon-button size-9 cursor-pointer rounded-full p-0"
    >
      {theme === 'light' ? <Sun /> : <Moon />}
    </Button>
  )
}
