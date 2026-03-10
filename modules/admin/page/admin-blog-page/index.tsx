'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { fetchBlogs } from '@/lib/api/blog'
import { fetchTags } from '@/lib/api/tag'
import Loading from '@/components/shared/loading'
import BlogListTable from './internal/blog-list-table'
import BlogSearch from './internal/blog-search'
import { BlogTagsContainer } from './internal/blog-tags-container'

export default function AdminBlogPage() {
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const { data: blogResponse, isPending: blogListPending } = useQuery({
    queryKey: ['blog-list', query, selectedTags],
    queryFn: () => {
      const tags = selectedTags.length > 0 ? selectedTags.join(',') : undefined
      return fetchBlogs({
        query: query.trim() || undefined,
        tags,
        page: 1,
        pageSize: 50,
      })
    },
    staleTime: 1000 * 30,
  })

  const { data: blogTagsData, isPending: blogTagsPending } = useQuery({
    queryKey: ['blog-tags'],
    queryFn: () => fetchTags('BLOG'),
    staleTime: 1000 * 60 * 5, // 5分钟缓存
  })

  const blogTags = blogTagsData?.map(t => ({ ...t, tagType: t.tagType as any })) ?? []

  return (
    <main className="w-full flex flex-col gap-2">
      <BlogSearch setQuery={setQuery} />

      {
        !blogTagsPending && <BlogTagsContainer blogTagList={blogTags ?? []} setSelectedTags={setSelectedTags} />
      }

      {
        blogListPending
          ? <Loading />
          : <BlogListTable blogList={(blogResponse?.items?.map((item: any) => ({
            ...item,
            tags: item.tags ?? [],
          })) as any) ?? []} />
      }
    </main>
  )
}
