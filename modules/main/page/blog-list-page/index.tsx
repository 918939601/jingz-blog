'use client'

import type { BlogDTO } from '@/lib/api/blog'
import type { Variants } from 'motion/react'
import * as motion from 'motion/react-client'
import { useMemo, useState } from 'react'
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

export default function BlogListPage({ initialBlogs }: { initialBlogs: BlogDTO[] }) {
  const allBlogs = useMemo(
    () => initialBlogs,
    [initialBlogs],
  )
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      return allBlogs
    }

    return allBlogs.filter((b) => {
      const titleHit = b.title.toLowerCase().includes(q)
      const contentHit = (b.content || '').toLowerCase().includes(q)
      return titleHit || contentHit
    })
  }, [allBlogs, query])

  if (allBlogs.length === 0) {
    return <p className="m-auto">虚无。</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="paper-card-strong grid gap-6 p-5 md:grid-cols-[minmax(0,1fr)_320px] md:p-8">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="paper-label">blog archive</span>
            <span className="paper-label !tracking-[0.18em]">long-form writing</span>
          </div>
          <h1 className="paper-title mt-5 text-4xl leading-tight md:text-5xl">博客</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/68 md:text-base">
            这里放的是更完整的文章，偏向可以反复回看的技术内容、经验总结和阶段性思考。
          </p>
        </div>

        <div className="rounded-[28px] border border-black/6 bg-black/[0.03] p-4 dark:border-white/10 dark:bg-white/[0.03]">
          <p className="text-xs uppercase tracking-[0.24em] text-foreground/42">Search</p>
          <div className="mt-3 flex items-center gap-3">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
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
              ? `共 ${filtered.length} 篇匹配 “${query}”`
              : `共 ${allBlogs.length} 篇已发布的博客`}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.22em] text-foreground/36">Press / to focus</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="paper-card p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-foreground/42">Count</p>
          <p className="paper-title mt-3 text-3xl">{allBlogs.length}</p>
        </div>
        <div className="paper-card p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-foreground/42">Focus</p>
          <p className="mt-3 text-sm leading-7 text-foreground/64">前端、Go、工程实践与长期沉淀。</p>
        </div>
        <div className="paper-card p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-foreground/42">Signal</p>
          <p className="mt-3 text-sm leading-7 text-foreground/64">优先保留那些以后还会重新查的内容。</p>
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
            <BlogListItem
              blogTitle={v.title}
              createdAt={new Date(v.createdAt)}
              slug={v.slug}
            />
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="paper-card p-8 text-center text-sm text-foreground/56">
            没有匹配到相关博客，换个关键词试试。
          </div>
        )}
      </motion.main>
    </div>
  )
}
