'use client'

import * as motion from 'motion/react-client'
import { fetchBlogs } from '@/lib/api/blog'
import BlogListItem from './internal/blog-list-item'
import type { Variants } from 'motion/react'
import { useQuery } from '@tanstack/react-query'
import Loading from '@/components/shared/loading'

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

  if (isPending) {
    return <Loading />
  }

  if (allBlogs.length === 0) {
    return <p className="m-auto">虚无。</p>
  }

  return (
    <motion.main
      className="flex flex-col px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {allBlogs.map(v => (
        <motion.div variants={itemVariants} key={v.id}>
          <BlogListItem
            blogTitle={v.title}
            createdAt={new Date(v.createdAt)}
            slug={v.slug}
          />
        </motion.div>
      ))}
    </motion.main>
  )
}
