'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { fetchNotes } from '@/lib/api/note'
import { fetchTags } from '@/lib/api/tag'
import Loading from '@/components/shared/loading'
import NoteListTable from './internal/note-list-table'
import NoteSearch from './internal/note-search'
import { NoteTagsContainer } from './internal/note-tags-container'

export default function AdminNotePage() {
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const { data: noteResponse, isPending: noteListPending } = useQuery({
    queryKey: ['note-list', query, selectedTags],
    queryFn: () => {
      const tags = selectedTags.length > 0 ? selectedTags.join(',') : undefined
      return fetchNotes({
        query: query.trim() || undefined,
        tags,
        page: 1,
        pageSize: 50,
      })
    },
    staleTime: 1000 * 30,
  })

  const { data: noteTagsData, isPending: noteTagsPending } = useQuery({
    queryKey: ['note-tags'],
    queryFn: () => fetchTags('NOTE'),
    staleTime: 1000 * 60 * 5, // 5分钟缓存
  })

  const noteTags = noteTagsData?.map(t => ({ ...t, tagType: t.tagType as any })) ?? []

  return (
    <main className="w-full flex flex-col gap-2">
      <NoteSearch setQuery={setQuery} />

      {
        !noteTagsPending && <NoteTagsContainer noteTagList={noteTags ?? []} setSelectedTags={setSelectedTags} />
      }

      {
        noteListPending
          ? <Loading />
          : <NoteListTable noteList={(noteResponse?.items?.map((item: any) => ({
            ...item,
            tags: item.tags ?? [],
          })) as any) ?? []} />
      }
    </main>
  )
}
