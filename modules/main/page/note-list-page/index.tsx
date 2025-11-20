'use client'

import * as motion from 'motion/react-client'
import { fetchNotes } from '@/lib/api/note'
import NoteListItem from './internal/note-list-item'
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

  const allNotes = response?.items?.filter(n => n.isPublished) || []

  if (isPending) {
    return <Loading />
  }

  if (allNotes.length === 0) {
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
      {allNotes.map(v => (
        <motion.div variants={itemVariants} key={v.id}>
          <NoteListItem
            noteTitle={v.title}
            createdAt={new Date(v.createdAt)}
            slug={v.slug}
          />
        </motion.div>
      ))}
    </motion.main>
  )
}
