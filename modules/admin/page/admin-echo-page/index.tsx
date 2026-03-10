'use client'

import { fetchEchos } from '@/lib/api/echo'
import Loading from '@/components/shared/loading'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import EchoListTable from './internal/echo-list-table'
import EchoSearch from './internal/echo-search'

export default function AdminEchoPage() {
  const [query, setQuery] = useState('')
  const { isPending, data } = useQuery({
    queryKey: ['echo-list', query],
    queryFn: () =>
      fetchEchos({ query: query.trim() || undefined, page: 1, pageSize: 50 })
      .then(r => r.items.map(e => ({ 
        id: Number(e.id),
        reference: e.reference,
        content: e.content,
        isPublished: e.isPublished,
        createdAt: new Date(e.createdAt),
      }))),
  })

  return (
    <main className="w-full flex flex-col gap-2">
      <EchoSearch setQuery={setQuery} />

      {
        isPending ? <Loading /> : <EchoListTable echoList={data ?? []} />
      }
    </main>
  )
}
