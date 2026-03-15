'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { TagDTO } from '@/lib/api/tag'
import {
  ArrowDown,
  ArrowUp,
  FileText,
  TagsIcon,
  TypeIcon,
  Wrench,
} from 'lucide-react'
import TagItemBadge from '@/components/shared/tag-item-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ActionButtons from './action-buttons'

interface TagWithCount extends TagDTO {
  count?: number
}

// * 后序整一个分类排序
export const columns: ColumnDef<TagWithCount>[] = [
  {
    accessorKey: 'tagName',
    header: () => {
      return (
        <span className="flex items-center gap-1">
          <TypeIcon className="size-4" />
          标签名
        </span>
      )
    },
    cell: ({ row }) => {
      return <TagItemBadge tag={row.original.tagName} />
    },
  },
  {
    accessorKey: 'tagType',
    header: () => {
      return (
        <span className="flex items-center gap-1">
          <TagsIcon className="size-4" />
          标签类型
        </span>
      )
    },
    cell: ({ row }) => {
      const tagType = row.original.tagType
      return <Badge className="font-mono">{tagType}</Badge>
    },
  },
  {
    accessorKey: 'count',
    header: ({ column }) => {
      const sorted = column.getIsSorted()

      return (
        <Button
          variant="ghost"
          size="sm"
          className="table-sort-button cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <FileText className="size-4" />
          关联文章数量
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
      const relatedArticleCount = row.original.count ?? 0
      return (
        <div className="flex max-w-36 justify-center font-mono text-base text-foreground/72">
          {relatedArticleCount > 0 ? relatedArticleCount : '0'}
        </div>
      )
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
      const { id, tagName, tagType } = row.original

      return <ActionButtons id={id} tagName={tagName} tagType={tagType as any} />
    },
  },
]
