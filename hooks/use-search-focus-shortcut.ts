import { useEffect } from 'react'

export function useSearchFocusShortcut(ref: React.RefObject<HTMLInputElement | null>) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const isTyping = target
        && (target.tagName === 'INPUT'
          || target.tagName === 'TEXTAREA'
          || target.getAttribute('contenteditable') === 'true')

      if (!isTyping && e.key === '/') {
        e.preventDefault()
        ref.current?.focus()
      }
    }

    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [ref])
}
