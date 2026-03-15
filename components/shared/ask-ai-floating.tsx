'use client'

import { MessageCircle, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import AskAiCard from './ask-ai-card'

interface AskAiFloatingProps {
  title?: string
  tags?: string[]
  anchorSelector?: string
}

const VIEWPORT_GUTTER = 16
const PANEL_DEFAULT = { w: 720, h: 440 }
const PANEL_MIN = { w: 420, h: 320 }

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export default function AskAiFloating({
  title,
  tags,
  anchorSelector = 'main',
}: AskAiFloatingProps) {
  const [open, setOpen] = useState(false)
  const [panelPos, setPanelPos] = useState({ x: 0, y: 0 })
  const [panelSize, setPanelSize] = useState(PANEL_DEFAULT)
  const panelDragging = useRef(false)
  const panelOffset = useRef({ x: 0, y: 0 })
  const resizing = useRef(false)
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 })
  const panelSizeRef = useRef(panelSize)
  const panelPosRef = useRef(panelPos)

  useEffect(() => {
    panelSizeRef.current = panelSize
    panelPosRef.current = panelPos
  }, [panelSize, panelPos])

  const getDefaultFrame = () => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 0
    const height = typeof window !== 'undefined' ? window.innerHeight : 0
    const nextW = Math.min(PANEL_DEFAULT.w, Math.max(PANEL_MIN.w, width - VIEWPORT_GUTTER * 2))
    const nextH = Math.min(PANEL_DEFAULT.h, Math.max(PANEL_MIN.h, height - 120))
    const anchor = document.querySelector(anchorSelector)
    const anchorRect = anchor?.getBoundingClientRect()
    const preferredX = anchorRect
      ? Math.max(VIEWPORT_GUTTER, anchorRect.right - nextW)
      : VIEWPORT_GUTTER
    const maxX = Math.max(VIEWPORT_GUTTER, width - nextW - VIEWPORT_GUTTER)
    const maxY = Math.max(VIEWPORT_GUTTER, height - nextH - VIEWPORT_GUTTER)

    return {
      x: clamp(preferredX, VIEWPORT_GUTTER, maxX),
      y: clamp(VIEWPORT_GUTTER + 72, VIEWPORT_GUTTER, maxY),
      w: nextW,
      h: nextH,
    }
  }

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (panelDragging.current) {
        setPanelPos(() => {
          const width = typeof window !== 'undefined' ? window.innerWidth : 0
          const height = typeof window !== 'undefined' ? window.innerHeight : 0
          const nextX = e.clientX - panelOffset.current.x
          const nextY = e.clientY - panelOffset.current.y
          const currentSize = panelSizeRef.current
          const maxX = Math.max(VIEWPORT_GUTTER, width - currentSize.w - VIEWPORT_GUTTER)
          const maxY = Math.max(VIEWPORT_GUTTER, height - currentSize.h - VIEWPORT_GUTTER)

          return {
            x: clamp(nextX, VIEWPORT_GUTTER, maxX),
            y: clamp(nextY, VIEWPORT_GUTTER, maxY),
          }
        })
      }

      if (resizing.current) {
        const width = typeof window !== 'undefined' ? window.innerWidth : 0
        const height = typeof window !== 'undefined' ? window.innerHeight : 0
        const currentPos = panelPosRef.current
        const maxW = Math.max(PANEL_MIN.w, width - currentPos.x - VIEWPORT_GUTTER)
        const maxH = Math.max(PANEL_MIN.h, height - currentPos.y - VIEWPORT_GUTTER)
        const deltaX = e.clientX - resizeStart.current.x
        const deltaY = e.clientY - resizeStart.current.y
        const nextW = clamp(resizeStart.current.w + deltaX, PANEL_MIN.w, maxW)
        const nextH = clamp(resizeStart.current.h + deltaY, PANEL_MIN.h, maxH)
        setPanelSize({ w: nextW, h: nextH })
      }
    }

    const handlePointerUp = () => {
      panelDragging.current = false
      resizing.current = false
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  return (
    <>
      {!open && (
        <button
          type="button"
          aria-label="打开 AI 问答"
          className="paper-card-strong fixed bottom-6 left-6 z-30 flex items-center gap-3 rounded-full px-4 py-3 text-primary transition-transform hover:-translate-y-1 dark:text-primary"
          onClick={() => {
            const nextFrame = getDefaultFrame()
            setPanelPos({ x: nextFrame.x, y: nextFrame.y })
            setPanelSize({ w: nextFrame.w, h: nextFrame.h })
            setOpen(true)
          }}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/85 bg-white/85 dark:border-white/12 dark:bg-white/[0.06]">
            <MessageCircle className="h-5 w-5" />
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-[11px] uppercase tracking-[0.24em] text-foreground/40">
              AI
            </span>
            <span className="mt-1 block text-sm font-semibold text-foreground">问问 AI</span>
          </span>
        </button>
      )}

      {open && (
        <div
          className="paper-card-strong fixed z-30 flex flex-col overflow-hidden"
          style={{
            left: panelPos.x,
            top: panelPos.y,
            width: panelSize.w,
            height: panelSize.h,
          }}
        >
          <div
            className="flex shrink-0 cursor-move items-center justify-between border-b border-black/6 px-4 py-4 dark:border-white/10"
            onPointerDown={(e) => {
              panelDragging.current = true
              panelOffset.current = {
                x: e.clientX - panelPos.x,
                y: e.clientY - panelPos.y,
              }
            }}
          >
            <div className="flex items-center gap-2">
              <span className="paper-label !px-2.5 !py-1 !tracking-[0.22em]">
                AI
              </span>
              <span className="text-sm font-semibold text-foreground">问问 AI</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1 rounded-full border border-white/80 bg-white/80 px-3 py-2 text-xs text-foreground/52 transition hover:text-primary dark:border-white/12 dark:bg-white/[0.06]"
            >
              关闭
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="relative min-h-0 flex-1 overflow-hidden p-4">
            <AskAiCard title={title} tags={tags} showHeader={false} />
          </div>

          <button
            type="button"
            aria-label="resize"
            className="absolute bottom-3 right-3 h-6 w-6 cursor-nwse-resize rounded-full border border-white/80 bg-white/82 text-primary shadow-sm hover:bg-white dark:border-white/12 dark:bg-white/[0.06]"
            onPointerDown={(e) => {
              e.stopPropagation()
              resizing.current = true
              resizeStart.current = {
                x: e.clientX,
                y: e.clientY,
                w: panelSize.w,
                h: panelSize.h,
              }
            }}
          />
        </div>
      )}
    </>
  )
}
