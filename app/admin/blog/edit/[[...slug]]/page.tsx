import { redirect } from 'next/navigation'
import { fetchBlogBySlug } from '@/lib/api/blog'
import { fetchTags } from '@/lib/api/tag'
import AdminArticleEditPage from '@/components/shared/admin-article-edit-page'
import { requireAdmin } from '@/lib/auth'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] | undefined }>
}) {
  try {
    await requireAdmin()
  }
  catch {
    redirect(`/admin/blog`)
  }

  const slug = (await params).slug?.[0] ?? null
  
  let article = null
  if (slug) {
    try {
      const blogDTO = await fetchBlogBySlug(slug)
      // Convert DTO to match Prisma type
      article = {
        ...blogDTO,
        createdAt: new Date(blogDTO.createdAt),
        updatedAt: new Date(blogDTO.updatedAt),
      } as any
    }
    catch {
      // Blog not found, continue with null
    }
  }

  const blogTagsDTO = await fetchTags('BLOG')
  const blogTags = blogTagsDTO.map(t => ({ ...t, tagType: t.tagType as any }))
  const relatedBlogTagNames = article ? (article.tags ?? []).map((v: any) => v.tagName) : []

  return (
    <AdminArticleEditPage
      article={article}
      relatedArticleTagNames={relatedBlogTagNames}
      allTags={blogTags}
    />
  )
}
