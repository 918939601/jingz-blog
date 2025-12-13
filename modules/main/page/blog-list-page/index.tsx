'use client'

import * as motion from 'motion/react-client'
import type { Variants } from 'motion/react'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Loading from '@/components/shared/loading'
import { fetchBlogs } from '@/lib/api/blog'
import BlogListItem from './internal/blog-list-item'

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
      type: 'tween' as const,
      ease: 'easeInOut' as const,
      duration: 0.8,
    },
  },
}

export default function BlogListPage() {
  const { data: response, isPending } = useQuery({
    queryKey: ['blog-list-public'],
    queryFn: () => fetchBlogs({ pageSize: 1000 }),
    staleTime: 1000 * 60 * 5,
  })

  const allBlogs = response?.items?.filter(b => b.isPublished) || []
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allBlogs
    return allBlogs.filter((b) => {
      const titleHit = b.title.toLowerCase().includes(q)
      const contentHit = (b.content || '').toLowerCase().includes(q)
      return titleHit || contentHit
    })
  }, [allBlogs, query])

  if (isPending) {
    return <Loading />
  }

  if (allBlogs.length === 0) {
    return <p className="m-auto">虚无。</p>
  }

  return (
    <div className="flex flex-col gap-4 px-4">
      <section className="rounded-2xl border border-purple-200/70 bg-white/50 p-4 shadow-sm backdrop-blur dark:border-emerald-300/30 dark:bg-slate-900/40">
        <div className="flex items-center gap-2 text-sm font-medium text-purple-700 dark:text-emerald-200">
          <span className="rounded-full border border-purple-300/80 px-2 py-0.5 text-xs font-semibold tracking-wide dark:border-emerald-200/50">
            搜索
          </span>
          <span>博客搜索</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">输入关键词快速定位文章</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="例如：性能优化、Kafka、React 表单、索引调优..."
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
            ? `共 ${filtered.length} 篇匹配 “${query}”`
            : `共 ${allBlogs.length} 篇已发布的博客`}
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
            <BlogListItem
              blogTitle={v.title}
              createdAt={new Date(v.createdAt)}
              slug={v.slug}
            />
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <p className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
            没有匹配到相关博客，换个关键词试试。
          </p>
        )}
      </motion.main>
    </div>
  )
}
