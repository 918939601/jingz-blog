'use client'

import type { TagDTO } from '@/lib/api/tag'
import Loading from '@/components/shared/loading'
import { motion } from 'motion/react'
import { DataTable } from './data-table'
import { columns } from './tag-table-column'

export default function TagListTable({ data, isPending }: { data: TagDTO[], isPending: boolean }) {
  return isPending
    ? <Loading />
    : (
        <motion.main
          className="flex-1"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 20,
          }}
        >
          <DataTable columns={columns} data={data ?? []} />
        </motion.main>
      )
}
