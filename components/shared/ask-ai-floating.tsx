'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import AskAiCard from './ask-ai-card'
import { MessageCircle, X } from 'lucide-react'
import clsx from 'clsx'

interface AskAiFloatingProps {
  title?: string
  tags?: string[]
  anchorSelector?: string // 目标内容区域，用于初始对齐右边界
}

const RIGHT_SIDEBAR_WIDTH = 16 // 右侧边栏宽度，可根据实际调整

export default function AskAiFloating({
  title,
  tags,
  anchorSelector = 'main',
}: AskAiFloatingProps) {
  const [open, setOpen] = useState(false)
  const [panelPos, setPanelPos] = useState({ x: 0, y: 0 })
  const [panelSize, setPanelSize] = useState({ w: 720, h: 400 })
  const panelDragging = useRef(false)
  const panelOffset = useRef({ x: 0, y: 0 })
  const resizing = useRef(false)
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 })
  const panelSizeRef = useRef(panelSize)
  const panelPosRef = useRef(panelPos)

  // 同步 ref 和 state
  useEffect(() => {
    panelSizeRef.current = panelSize
    panelPosRef.current = panelPos
  }, [panelSize, panelPos])



  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (panelDragging.current) {
        setPanelPos(() => {
          const width = typeof window !== 'undefined' ? window.innerWidth : 0
          const height = typeof window !== 'undefined' ? window.innerHeight : 0
          const nextX = e.clientX - panelOffset.current.x
          const nextY = e.clientY - panelOffset.current.y
          const currentSize = panelSizeRef.current
          const maxY = Math.max(12, height - currentSize.h - 12)
          return {
            x: Math.min(Math.max(12, nextX), Math.max(12, width - currentSize.w - RIGHT_SIDEBAR_WIDTH)),
            y: Math.min(Math.max(12, nextY), maxY),
          }
        })
      }

      if (resizing.current) {
        const width = typeof window !== 'undefined' ? window.innerWidth : 0
        const height = typeof window !== 'undefined' ? window.innerHeight : 0
        const minW = 480
        const minH = 320
        const currentPos = panelPosRef.current
        const maxW = Math.max(minW, width - currentPos.x - RIGHT_SIDEBAR_WIDTH)
        const maxH = Math.max(minH, height - currentPos.y - 24)
        const deltaX = e.clientX - resizeStart.current.x
        const deltaY = e.clientY - resizeStart.current.y
        const nextW = Math.min(Math.max(minW, resizeStart.current.w + deltaX), maxW)
        const nextH = Math.min(Math.max(minH, resizeStart.current.h + deltaY), maxH)
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

  useEffect(() => {
    if (!open) return
    const width = typeof window !== 'undefined' ? window.innerWidth : 0
    const height = typeof window !== 'undefined' ? window.innerHeight : 0
    const defaultW = Math.min(720, width - 32)
    const defaultH = 400 // 初始高度

    // 默认固定在左上角，留出边距
    const gutter = 16
    const x = gutter
    const y = gutter + 80

    setPanelPos({ x, y })
    setPanelSize({ w: defaultW, h: defaultH })
  }, [open])

  return (
    <>
      {!open && (
        <button
          type="button"
          aria-label="打开 AI 问答"
          className="fixed bottom-120 left-6 z-10 flex h-14 w-14 items-center justify-center rounded-full border border-purple-300/70 bg-gradient-to-br from-white/90 to-purple-50/80 text-purple-700 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:shadow-xl active:scale-95 dark:border-emerald-200/40 dark:from-slate-900/90 dark:to-slate-800/70 dark:text-emerald-200 animate-pulse"
          onClick={() => setOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {open && (
        <div
          className="fixed z-10 flex flex-col rounded-2xl border border-purple-200/80 bg-gradient-to-br from-white/95 to-purple-50/80 shadow-2xl backdrop-blur dark:border-emerald-200/40 dark:from-slate-900/95 dark:to-slate-800/80"
          style={{
            left: panelPos.x,
            top: panelPos.y,
            width: panelSize.w,
            height: panelSize.h,
          }}
        >
          <div
            className="flex shrink-0 cursor-move items-center justify-between p-4 pb-3"
            onPointerDown={(e) => {
              panelDragging.current = true
              panelOffset.current = {
                x: e.clientX - panelPos.x,
                y: e.clientY - panelPos.y,
              }
            }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-purple-700 dark:text-emerald-200">
              <span className="rounded-full border border-purple-300/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide dark:border-emerald-200/50">
                AI
              </span>
              <span>问问 AI</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1 text-xs text-gray-500 transition hover:text-purple-600 dark:text-gray-400 dark:hover:text-emerald-200"
            >
              关闭
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4">
            <AskAiCard title={title} tags={tags} showHeader={false} />
          </div>
          <button
            type="button"
            aria-label="resize"
            className="absolute bottom-2 right-2 h-5 w-5 cursor-nwse-resize rounded-sm border border-purple-200/70 bg-white/70 text-purple-400 shadow-sm hover:bg-white dark:border-emerald-200/40 dark:bg-slate-800/80 dark:text-emerald-200"
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
