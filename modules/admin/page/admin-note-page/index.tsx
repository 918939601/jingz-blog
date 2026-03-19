'use client'

import { useQuery } from '@tanstack/react-query'
import { useDeferredValue, useState } from 'react'
import Loading from '@/components/shared/loading'
import type { NoteListResponse } from '@/lib/api/note'
import type { TagDTO } from '@/lib/api/tag'
import { fetchNotes } from '@/lib/api/note'
import { fetchTags } from '@/lib/api/tag'
import NoteListTable from './internal/note-list-table'
import NoteSearch from './internal/note-search'
import { NoteTagsContainer } from './internal/note-tags-container'

export default function AdminNotePage({
  initialNoteResponse,
  initialNoteTags,
}: {
  initialNoteResponse?: NoteListResponse
  initialNoteTags?: TagDTO[]
}) {
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const deferredQuery = useDeferredValue(query)
  const isDefaultQuery = deferredQuery.trim() === '' && selectedTags.length === 0

  const { data: noteResponse, isPending: noteListPending, isFetching: noteListFetching } = useQuery({
    queryKey: ['note-list', deferredQuery, selectedTags],
    queryFn: () => {
      const tags = selectedTags.length > 0 ? selectedTags.join(',') : undefined
      return fetchNotes({
        query: deferredQuery.trim() || undefined,
        tags,
        page: 1,
        pageSize: 50,
      })
    },
    staleTime: 1000 * 30,
    placeholderData: previousData => previousData,
    initialData: isDefaultQuery ? initialNoteResponse : undefined,
  })

  const { data: noteTagsData, isPending: noteTagsPending } = useQuery({
    queryKey: ['note-tags'],
    queryFn: () => fetchTags('NOTE'),
    staleTime: 1000 * 60 * 5, // 5分钟缓存
    initialData: initialNoteTags,
  })

  const noteTags = noteTagsData?.map(t => ({ ...t, tagType: t.tagType as any })) ?? []

  return (
    <main className="flex w-full flex-col gap-5">
      <NoteSearch
        query={query}
        setQuery={setQuery}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        resultCount={noteResponse?.items?.length ?? 0}
        selectedTagCount={selectedTags.length}
        isSearching={query !== deferredQuery || noteListFetching}
      />
      {!noteTagsPending && (
        <NoteTagsContainer
          noteTagList={noteTags ?? []}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      )}
      {noteListPending && !noteResponse
        ? <Loading />
        : (
            <NoteListTable noteList={(noteResponse?.items?.map((item: any) => ({
              ...item,
              tags: item.tags ?? [],
            })) as any) ?? []}
            />
          )}
    </main>
  )
}
