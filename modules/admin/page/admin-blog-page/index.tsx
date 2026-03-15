'use client'

import { useQuery } from '@tanstack/react-query'
import { useDeferredValue, useState } from 'react'
import Loading from '@/components/shared/loading'
import { fetchBlogs } from '@/lib/api/blog'
import { fetchTags } from '@/lib/api/tag'
import BlogListTable from './internal/blog-list-table'
import BlogSearch from './internal/blog-search'
import { BlogTagsContainer } from './internal/blog-tags-container'

export default function AdminBlogPage() {
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const deferredQuery = useDeferredValue(query)

  const { data: blogResponse, isPending: blogListPending, isFetching: blogListFetching } = useQuery({
    queryKey: ['blog-list', deferredQuery, selectedTags],
    queryFn: () => {
      const tags = selectedTags.length > 0 ? selectedTags.join(',') : undefined
      return fetchBlogs({
        query: deferredQuery.trim() || undefined,
        tags,
        page: 1,
        pageSize: 50,
      })
    },
    staleTime: 1000 * 30,
    placeholderData: previousData => previousData,
  })

  const { data: blogTagsData, isPending: blogTagsPending } = useQuery({
    queryKey: ['blog-tags'],
    queryFn: () => fetchTags('BLOG'),
    staleTime: 1000 * 60 * 5, // 5分钟缓存
  })

  const blogTags = blogTagsData?.map(t => ({ ...t, tagType: t.tagType as any })) ?? []

  return (
    <main className="flex w-full flex-col gap-5">
      <BlogSearch
        query={query}
        setQuery={setQuery}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        resultCount={blogResponse?.items?.length ?? 0}
        selectedTagCount={selectedTags.length}
        isSearching={query !== deferredQuery || blogListFetching}
      />
      {!blogTagsPending && (
        <BlogTagsContainer
          blogTagList={blogTags ?? []}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      )}
      {blogListPending && !blogResponse
        ? <Loading />
        : (
            <BlogListTable blogList={(blogResponse?.items?.map((item: any) => ({
              ...item,
              tags: item.tags ?? [],
            })) as any) ?? []}
            />
          )}
    </main>
  )
}
