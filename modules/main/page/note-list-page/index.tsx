'use client'

import type { Variants } from 'motion/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import * as motion from 'motion/react-client'
import { useEffect, useMemo, useRef, useState } from 'react'
import Loading from '@/components/shared/loading'
import { fetchNoteBySlug, fetchNotes } from '@/lib/api/note'
import NoteListItem from './internal/note-list-item'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: [30, -8, 0],
    transition: {
      type: 'tween',
      ease: 'easeInOut',
      duration: 0.8,
    },
  },
}

export default function NoteListPage() {
  const queryClient = useQueryClient()
  const { data: response, isPending } = useQuery({
    queryKey: ['note-list-public'],
    queryFn: () => fetchNotes({ pageSize: 1000 }),
    staleTime: 1000 * 60 * 5,
  })

  const publishedNotes = useMemo(
    () =>
      response?.items
        ?.filter(n => n.isPublished)
        .map(n => ({ ...n, createdAt: new Date(n.createdAt) })) || [],
    [response],
  )

  // 预加载所有笔记详情
  useEffect(() => {
    if (publishedNotes.length > 0) {
      publishedNotes.forEach((note) => {
        queryClient.prefetchQuery({
          queryKey: ['note', note.slug],
          queryFn: () => fetchNoteBySlug(note.slug),
          staleTime: 1000 * 60 * 5,
        })
      })
    }
  }, [publishedNotes, queryClient])

  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      return publishedNotes
    }

    return publishedNotes.filter((note) => {
      const titleHit = note.title.toLowerCase().includes(q)
      const tagHit = (note.tags || []).some(t => t.tagName.toLowerCase().includes(q))
      const contentHit = (note.content || '').toLowerCase().includes(q)
      return titleHit || tagHit || contentHit
    })
  }, [publishedNotes, query])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const isTyping = target
        && (target.tagName === 'INPUT'
          || target.tagName === 'TEXTAREA'
          || target.getAttribute('contenteditable') === 'true')

      if (!isTyping && e.key === '/') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (isPending) {
    return <Loading />
  }

  if (publishedNotes.length === 0) {
    return <p className="m-auto">虚无。</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="paper-card-strong grid gap-6 p-5 md:grid-cols-[minmax(0,1fr)_320px] md:p-8">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="paper-label">note archive</span>
            <span className="paper-label !tracking-[0.18em]">fast retrieval</span>
          </div>
          <h1 className="paper-title mt-5 text-4xl leading-tight md:text-5xl">笔记</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/68 md:text-base">
            这里更像随时可翻的个人知识索引，偏短、偏快，也更适合保存过程中的碎片结论。
          </p>
        </div>

        <div className="rounded-[28px] border border-black/6 bg-black/[0.03] p-4 dark:border-white/10 dark:bg-white/[0.03]">
          <p className="text-xs uppercase tracking-[0.24em] text-foreground/42">Search</p>
          <div className="mt-3 flex items-center gap-3">
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setQuery('')
                }
              }}
              placeholder="输入标题"
              className="w-full rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#57b8ab] focus:ring-2 focus:ring-[#57b8ab]/20 dark:border-white/12 dark:bg-white/[0.06] dark:focus:border-[#57b8ab] dark:focus:ring-[#57b8ab]/20"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="shrink-0 rounded-full border border-white/80 bg-white/82 px-4 py-2 text-xs text-foreground/56 transition hover:text-primary dark:border-white/12 dark:bg-white/[0.06]"
              >
                清空
              </button>
            )}
          </div>
          <p className="mt-3 text-sm text-foreground/56">
            {query
              ? `共 ${filtered.length} 条匹配 “${query}”`
              : `共 ${publishedNotes.length} 条已发布的笔记`}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.22em] text-foreground/36">Press / to focus</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="paper-card p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-foreground/42">Count</p>
          <p className="paper-title mt-3 text-3xl">{publishedNotes.length}</p>
        </div>
        <div className="paper-card p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-foreground/42">Intent</p>
          <p className="mt-3 text-sm leading-7 text-foreground/64">更快地记录，更快地检索，不强行写成长文。</p>
        </div>
        <div className="paper-card p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-foreground/42">Shortcut</p>
          <p className="mt-3 text-sm leading-7 text-foreground/64">列表页支持 `/` 快速聚焦搜索框，适合回查。</p>
        </div>
      </section>

      <motion.main
        className="flex flex-col gap-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {filtered.map(v => (
          <motion.div variants={itemVariants} key={v.id}>
            <NoteListItem
              noteTitle={v.title}
              createdAt={v.createdAt}
              slug={v.slug}
            />
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="paper-card p-8 text-center text-sm text-foreground/56">
            没有匹配到相关笔记，换个关键词试试。
          </div>
        )}
      </motion.main>
    </div>
  )
}
