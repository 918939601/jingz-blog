'use client'

import type { ColumnDef } from '@tanstack/react-table'
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Eye,
  Quote,
  TypeIcon,
  Wrench,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { prettyDateTime } from '@/lib/time'
import ActionButtons from './action-buttons'
import PublishToggleSwitch from './publish-toggle-switch'

interface Echo {
  id: number
  reference: string
  content: string
  isPublished: boolean
  createdAt: Date
}

export const columns: ColumnDef<Echo>[] = [
  {
    accessorKey: 'content',
    header: () => {
      return (
        <span className="flex items-center gap-1">
          <TypeIcon className="size-4" />
          内容
        </span>
      )
    },
    cell: ({ row }) => (
      <div className="max-w-[320px]">
        <p className="line-clamp-2 text-sm leading-6 text-foreground/76">{row.original.content}</p>
      </div>
    ),
  },
  {
    accessorKey: 'reference',
    header: () => {
      return (
        <span className="flex items-center gap-1">
          <Quote className="size-4" />
          来源
        </span>
      )
    },
    cell: ({ row }) => {
      const reference = row.original.reference.toString()
      return <span className="text-sm text-foreground/64">{reference}</span>
    },
  },
  {
    accessorKey: 'isPublished',
    header: () => {
      return (
        <span className="flex items-center gap-1">
          <Eye className="size-4" />
          是否发布
        </span>
      )
    },
    cell: ({ row }) => {
      return <PublishToggleSwitch echoId={row.original.id} isPublished={row.original.isPublished} key={row.original.id} />
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      const sorted = column.getIsSorted()
      return (
        <Button
          variant="ghost"
          size="sm"
          className="table-sort-button cursor-pointer"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          <CalendarDays className="size-4" />
          创建时间
          {sorted === 'asc'
            ? (
                <ArrowUp />
              )
            : sorted === 'desc'
              ? (
                  <ArrowDown />
                )
              : null}
        </Button>
      )
    },
    cell: ({ row }) => {
      const prettyTime = prettyDateTime(row.original.createdAt)
      return <time className="font-mono text-sm text-foreground/64">{prettyTime}</time>
    },
  },
  {
    accessorKey: 'actions',
    header: () => {
      return (
        <span className="flex items-center gap-1">
          <Wrench className="size-4" />
          操作
        </span>
      )
    },
    cell: ({ row }) => {
      const { id, content, isPublished, reference } = row.original

      return (
        <ActionButtons
          content={content}
          id={id}
          isPublished={isPublished}
          reference={reference}
        />
      )
    },
  },
]
