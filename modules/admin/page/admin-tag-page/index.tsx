'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { fetchTags } from '@/lib/api/tag'
import TagListTable from './internal/tag-list-table'
import TagSearch from './internal/tag-search'

export default function AdminTagPage() {
  const [query, setQuery] = useState('')
  const { isPending, data } = useQuery({
    queryKey: ['tags'],
    queryFn: () => fetchTags(),
    staleTime: 1000 * 30,
  })
  const filteredData = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) {
      return data || []
    }

    return (data || []).filter(tag =>
      tag.tagName.toLowerCase().includes(keyword)
      || tag.tagType.toLowerCase().includes(keyword),
    )
  }, [data, query])

  return (
    <main className="flex w-full flex-col gap-5">
      <TagSearch
        query={query}
        setQuery={setQuery}
        resultCount={filteredData.length}
      />
      <TagListTable data={filteredData} isPending={isPending} />
    </main>
  )
}
