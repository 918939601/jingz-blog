import { unstable_cache } from 'next/cache'
import { fetchBlogs } from '@/lib/api/blog'
import { fetchBlogHtmlBySlug } from '@/lib/api/blog'
import { fetchNotes } from '@/lib/api/note'
import { fetchNoteHtmlBySlug } from '@/lib/api/note'
import { processor } from '@/lib/markdown'

export interface ArticlePageData {
  id: number
  title: string
  createdAt: string
  tags: string[]
  htmlContent: string
}

async function buildArticlePageData(article: {
  id: number
  title: string
  content: string
  createdAt: string
  tags?: Array<{ tagName: string }>
}): Promise<ArticlePageData> {
  return {
    id: article.id,
    title: article.title,
    createdAt: article.createdAt,
    tags: (article.tags || []).map(tag => tag.tagName),
    htmlContent: String(await processor.process(article.content || '')),
  }
}

export async function getCachedBlogPageData(slug: string): Promise<ArticlePageData> {
  return unstable_cache(
    async () => {
      const article = await fetchBlogHtmlBySlug(slug)
      return buildArticlePageData(article)
    },
    ['blog-page-data', slug],
    { revalidate: 300 },
  )()
}

export async function getCachedNotePageData(slug: string): Promise<ArticlePageData> {
  return unstable_cache(
    async () => {
      const article = await fetchNoteHtmlBySlug(slug)
      return buildArticlePageData(article)
    },
    ['note-page-data', slug],
    { revalidate: 300 },
  )()
}

export async function getCachedBlogListData() {
  return unstable_cache(
    async () => {
      const response = await fetchBlogs({ pageSize: 1000 })
      return response.items.filter(blog => blog.isPublished)
    },
    ['blog-list-data'],
    { revalidate: 300 },
  )()
}

export async function getCachedNoteListData() {
  return unstable_cache(
    async () => {
      const response = await fetchNotes({ pageSize: 1000 })
      return response.items.filter(note => note.isPublished)
    },
    ['note-list-data'],
    { revalidate: 300 },
  )()
}
