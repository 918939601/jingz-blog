'use client'

import type { Dispatch, SetStateAction } from 'react'
import { Plus, RotateCw, Search } from 'lucide-react'
import Link from 'next/link'
import { memo, useRef } from 'react'
import AdminActiveFilterBar from '@/components/shared/admin-active-filter-bar'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSearchFocusShortcut } from '@/hooks/use-search-focus-shortcut'
import { cn } from '@/lib/utils'

function NoteSearch({
  query,
  setQuery,
  selectedTags,
  setSelectedTags,
  resultCount,
  selectedTagCount,
  isSearching,
}: {
  query: string
  setQuery: Dispatch<SetStateAction<string>>
  selectedTags: string[]
  setSelectedTags: Dispatch<SetStateAction<string[]>>
  resultCount: number
  selectedTagCount: number
  isSearching: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const keyword = query.trim()
  useSearchFocusShortcut(inputRef)

  return (
    <section className="paper-card-strong grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:p-6">
      <div>
        <div className="flex flex-wrap gap-2">
          <span className="paper-label">note manager</span>
          <span className="paper-label !tracking-[0.18em]">knowledge fragments</span>
        </div>
        <p className="mt-4 text-sm text-foreground/58">检索笔记、筛标签、处理发布状态，保持知识库整洁。</p>
      </div>

      <div className="flex flex-col gap-3 md:items-end">
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
          <Input
            placeholder="按标题搜索笔记"
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

            <Link
              className={cn(
                buttonVariants({ variant: 'secondary' }),
                'cursor-pointer rounded-full border-white/80 bg-white/82 dark:border-white/12 dark:bg-white/[0.06]',
              )}
              href="note/edit"
            >
              <Plus />
              创建笔记
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.18em] text-foreground/40">
          <p className="normal-case tracking-normal text-sm text-foreground/56">
            {isSearching
              ? '搜索中...'
              : keyword
                ? `共 ${resultCount} 条匹配 “${keyword}”`
                : selectedTagCount > 0
                  ? `当前筛出 ${resultCount} 条笔记，已选 ${selectedTagCount} 个标签`
                  : `共 ${resultCount} 条笔记`}
          </p>
          <p>/ 聚焦 · Esc 清空</p>
        </div>
        <AdminActiveFilterBar
          query={query}
          tags={selectedTags}
          onClearQuery={() => setQuery('')}
          onRemoveTag={tag => setSelectedTags(current => current.filter(item => item !== tag))}
          onClearAll={() => {
            setQuery('')
            setSelectedTags([])
          }}
        />
      </div>
    </section>
  )
}

export default memo(NoteSearch)
