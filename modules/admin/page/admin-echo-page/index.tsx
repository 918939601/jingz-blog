'use client'

import { getAllEchos, getQueryEchos } from '@/actions/echos'
import Loading from '@/components/shared/loading'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import EchoListTable from './internal/echo-list-table'
import EchoSearch from './internal/echo-search'

export default function AdminEchoPage() {
  const [query, setQuery] = useState('')
  const { isPending, data } = useQuery({
    queryKey: ['echo-list', query],
    queryFn: () => query.trim() ? getQueryEchos(query) : getAllEchos(),
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
