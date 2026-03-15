'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { BlogDTO } from '@/lib/api/blog'
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Eye,
  TagIcon,
  TypeIcon,
  Wrench,
} from 'lucide-react'
import TagItemBadge from '@/components/shared/tag-item-badge'
import { Button } from '@/components/ui/button'
import { prettyDateTime } from '@/lib/time'
import ActionButtons from './action-buttons'
import PublishToggleSwitch from './publish-toggle-switch'

export const columns: ColumnDef<BlogDTO>[] = [
  {
    accessorKey: 'title',
    header: () => {
      return (
        <span className="flex items-center gap-1">
          <TypeIcon className="size-4" />
          标题
        </span>
      )
    },
    cell: ({ row }) => (
      <div className="max-w-[260px]">
        <p className="line-clamp-2 font-medium text-foreground">{row.original.title}</p>
      </div>
    ),
  },
  {
    accessorKey: 'tags',
    header: () => {
      return (
        <span className="flex items-center gap-1">
          <TagIcon className="size-4" />
          标签
        </span>
      )
    },
    cell: ({ row }) => {
      const tags = row.original.tags || []

      return (
        <div className="flex max-w-[260px] flex-wrap gap-1.5">
          {tags.map(tag => (
            <TagItemBadge tag={tag.tagName} key={tag.id} />
          ))}
        </div>
      )
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
      const blog = row.original

      return (
        <PublishToggleSwitch blogId={blog.id} isPublished={blog.isPublished} key={blog.id} />
      )
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
      const prettyTime = prettyDateTime(new Date(row.original.createdAt))
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
      const { id, slug, title } = row.original

      return <ActionButtons blogId={id} slug={slug} title={title} />
    },
  },
]
