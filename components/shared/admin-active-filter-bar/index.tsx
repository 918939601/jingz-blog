'use client'

import { Search, Tags, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const EMPTY_TAGS: string[] = []

export default function AdminActiveFilterBar({
  query,
  tags = EMPTY_TAGS,
  onClearQuery,
  onRemoveTag,
  onClearAll,
}: {
  query?: string
  tags?: string[]
  onClearQuery?: () => void
  onRemoveTag?: (tag: string) => void
  onClearAll?: () => void
}) {
  const keyword = query?.trim() ?? ''
  const hasFilters = Boolean(keyword) || tags.length > 0

  if (!hasFilters) {
    return null
  }

  return (
    <div className="paper-card mt-3 flex flex-wrap items-center justify-between gap-3 rounded-[22px] px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="paper-label">active filters</span>

        {keyword && (
          <button
            type="button"
            onClick={onClearQuery}
            className="glass-field inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-foreground/72 transition hover:text-primary"
          >
            <Search className="size-3.5" />
            <span>{keyword}</span>
            <X className="size-3.5" />
          </button>
        )}

        {tags.map(tag => (
          <button
            type="button"
            key={tag}
            onClick={() => onRemoveTag?.(tag)}
            className="glass-field inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-foreground/72 transition hover:text-primary"
          >
            <Tags className="size-3.5" />
            <span>{tag}</span>
            <X className="size-3.5" />
          </button>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onClearAll}
        className="cursor-pointer rounded-full"
      >
        清空全部
      </Button>
    </div>
  )
}
