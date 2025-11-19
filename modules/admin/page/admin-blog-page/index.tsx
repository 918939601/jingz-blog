'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { fetchBlogs } from '@/lib/api/blog'
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

  // TODO: 从 Go API 获取标签列表
  // 暂时使用空数组，后续需要实现 Tags API
  const blogTags: any[] = []
  const blogTagsPending = false

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
