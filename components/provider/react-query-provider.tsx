'use client'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const ReactQueryDevtools = dynamic(
  () => import('./react-query-devtools').then(mod => mod.default),
  { ssr: false },
)

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' ? <ReactQueryDevtools /> : null}
    </QueryClientProvider>
  )
}
