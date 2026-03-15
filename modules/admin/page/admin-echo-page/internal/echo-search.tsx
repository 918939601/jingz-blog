'use client'

import type { Dispatch, SetStateAction } from 'react'
import { Plus, RotateCw, Search } from 'lucide-react'
import { memo, useRef } from 'react'
import AdminActiveFilterBar from '@/components/shared/admin-active-filter-bar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSearchFocusShortcut } from '@/hooks/use-search-focus-shortcut'
import { useModalStore } from '@/store/use-modal-store'

function EchoSearch({
  query,
  setQuery,
  resultCount,
  isSearching,
}: {
  query: string
  setQuery: Dispatch<SetStateAction<string>>
  resultCount: number
  isSearching: boolean
}) {
  const { setModalOpen } = useModalStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const keyword = query.trim()
  useSearchFocusShortcut(inputRef)

  return (
    <section className="paper-card-strong grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:p-6">
      <div>
        <div className="flex flex-wrap gap-2">
          <span className="paper-label">echo manager</span>
          <span className="paper-label !tracking-[0.18em]">short fragments</span>
        </div>
        <p className="mt-4 text-sm text-foreground/58">管理首页展示的引用和碎语，适合快速增删和发布。</p>
      </div>

      <div className="flex flex-col gap-3 md:items-end">
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
          <Input
            placeholder="按引用内容搜索"
            className="min-w-[280px] rounded-full border-white/80 bg-white/82 dark:border-white/12 dark:bg-white/[0.06]"
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setQuery('')
                inputRef.current?.blur()
              }
            }}
          />

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                inputRef.current?.focus()
                inputRef.current?.select()
              }}
              className="cursor-pointer rounded-full border-white/80 bg-white/82 dark:border-white/12 dark:bg-white/[0.06]"
            >
              <Search />
              聚焦
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className="cursor-pointer rounded-full border-white/80 bg-white/82 dark:border-white/12 dark:bg-white/[0.06]"
            >
              <RotateCw />
              重置
            </Button>

            <Button
              className="cursor-pointer rounded-full border-white/80 bg-white/82 dark:border-white/12 dark:bg-white/[0.06]"
              variant="secondary"
              onClick={() => {
                setModalOpen('createEchoModal')
              }}
            >
              <Plus />
              创建引用
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.18em] text-foreground/40">
          <p className="normal-case tracking-normal text-sm text-foreground/56">
            {isSearching
              ? '搜索中...'
              : keyword
                ? `共 ${resultCount} 条匹配 “${keyword}”`
                : `共 ${resultCount} 条引用`}
          </p>
          <p>/ 聚焦 · Esc 清空</p>
        </div>
        <AdminActiveFilterBar
          query={query}
          onClearQuery={() => setQuery('')}
          onClearAll={() => setQuery('')}
        />
      </div>
    </section>
  )
}

export default memo(EchoSearch)
