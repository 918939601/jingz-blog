import AdminArticleEditPage from '@/components/shared/admin-article-edit-page'
import { fetchBlogBySlug } from '@/lib/api/blog'
import { fetchTags } from '@/lib/api/tag'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] | undefined }>
}) {
  const slug = (await params).slug?.[0] ?? null

  let article = null
  const articlePromise = slug
    ? fetchBlogBySlug(slug).catch(() => null)
    : Promise.resolve(null)
  const blogTagsPromise = fetchTags('BLOG')

  const [blogDTO, blogTagsDTO] = await Promise.all([articlePromise, blogTagsPromise])

  if (blogDTO) {
    try {
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
