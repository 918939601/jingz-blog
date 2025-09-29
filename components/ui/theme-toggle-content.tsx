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
      className='cursor-pointer'
    >
      {theme === 'light' ? <Sun /> : <Moon />}
    </Button>
  )
}