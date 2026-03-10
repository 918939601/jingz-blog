'use client'

import * as motion from 'motion/react-client'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Variants } from 'motion/react'
import { useQuery } from '@tanstack/react-query'
import Loading from '@/components/shared/loading'
import { fetchNotes } from '@/lib/api/note'
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

  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return publishedNotes
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
      const isTyping =
        target
        && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.getAttribute('contenteditable') === 'true')

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
    <div className="flex flex-col gap-6 px-4">
      <section className="rounded-2xl border border-purple-200/70 bg-white/50 p-4 shadow-sm backdrop-blur dark:border-emerald-300/30 dark:bg-slate-900/40">
        <div className="flex items-center gap-2 text-sm font-medium text-purple-700 dark:text-emerald-200">
          <span className="rounded-full border border-purple-300/80 px-2 py-0.5 text-xs font-semibold tracking-wide dark:border-emerald-200/50">
            搜索
          </span>
          <span>笔记搜索</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">输入关键词或描述快速找笔记</span>
        </div>
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
            placeholder="例如：React 性能优化、Kafka、最近的部署记录..."
            className="w-full rounded-xl border border-purple-200/70 bg-white/70 px-4 py-3 text-sm text-gray-800 shadow-inner outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:border-emerald-200/40 dark:bg-slate-950/60 dark:text-gray-100 dark:focus:border-emerald-300 dark:focus:ring-emerald-200/30"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="shrink-0 rounded-lg px-3 py-2 text-xs text-gray-500 transition hover:text-purple-600 dark:text-gray-400 dark:hover:text-emerald-200"
            >
              清空
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {query
            ? `共 ${filtered.length} 条匹配 “${query}”`
            : `共 ${publishedNotes.length} 条已发布的笔记`}
        </p>
      </section>

      <motion.main
        className="flex flex-col"
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
          <p className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
            没有匹配到相关笔记，换个关键词试试。
          </p>
        )}
      </motion.main>

    </div>
  )
}
