'use client'

import type { Dispatch, SetStateAction } from 'react'
import { Toggle } from '@/components/ui/toggle'

export function NoteTagItemToggle({
  tag,
  selectedTags,
  setSelectedTags,
}: {
  tag: string
  selectedTags: string[]
  setSelectedTags: Dispatch<SetStateAction<string[]>>
}) {
  return (
    <Toggle
      variant="outline"
      size="sm"
      pressed={selectedTags.includes(tag)}
      className="cursor-pointer rounded-full border-white/80 bg-white/82 px-4 dark:border-white/12 dark:bg-white/[0.06] data-[state=on]:border-[#57b8ab] data-[state=on]:bg-[#57b8ab]/12"
      onPressedChange={(selected) => {
        setSelectedTags(beforeSelectedTags => selected ? [...beforeSelectedTags, tag] : beforeSelectedTags.filter(t => t !== tag))
      }}
    >
      {tag}
    </Toggle>
  )
}
