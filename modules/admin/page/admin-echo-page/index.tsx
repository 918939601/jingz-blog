'use client'

import { useQuery } from '@tanstack/react-query'
import { useDeferredValue, useState } from 'react'
import Loading from '@/components/shared/loading'
import { fetchEchos } from '@/lib/api/echo'
import EchoListTable from './internal/echo-list-table'
import EchoSearch from './internal/echo-search'

export default function AdminEchoPage() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const { isPending, isFetching, data } = useQuery({
    queryKey: ['echo-list', deferredQuery],
    queryFn: () =>
      fetchEchos({ query: deferredQuery.trim() || undefined, page: 1, pageSize: 50 })
        .then(r => r.items.map(e => ({
          id: Number(e.id),
          reference: e.reference,
          content: e.content,
          isPublished: e.isPublished,
          createdAt: new Date(e.createdAt),
        }))),
    placeholderData: previousData => previousData,
  })

  return (
    <main className="flex w-full flex-col gap-5">
      <EchoSearch
        query={query}
        setQuery={setQuery}
        resultCount={data?.length ?? 0}
        isSearching={query !== deferredQuery || isFetching}
      />
      {isPending && !data ? <Loading /> : <EchoListTable echoList={data ?? []} />}
    </main>
  )
}
