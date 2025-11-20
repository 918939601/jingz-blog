'use client'

import { fetchTags } from '@/lib/api/tag'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import TagListTable from './internal/tag-list-table'
import TagSearch from './internal/tag-search'

export default function AdminTagPage() {
  const [query, setQuery] = useState('')
  const { isPending, data } = useQuery({
    queryKey: ['tags', query],
    queryFn: () => fetchTags(),
    staleTime: 1000 * 30,
  })

  return (
    <main className="w-full flex flex-col gap-2">
      <TagSearch setQuery={setQuery} />
      <TagListTable data={data || []} isPending={isPending} />
    </main>
  )
}
