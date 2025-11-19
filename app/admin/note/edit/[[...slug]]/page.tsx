import { fetchNoteBySlug } from '@/lib/api/note'
import { fetchTags } from '@/lib/api/tag'
import AdminArticleEditPage from '@/components/shared/admin-article-edit-page'
import { requireAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] | undefined }>
}) {
  try {
    await requireAdmin()
  }
  catch {
    redirect(`/admin/note`)
  }

  const slug = (await params).slug?.[0] ?? null

  let article = null
  if (slug) {
    try {
      const noteDTO = await fetchNoteBySlug(slug)
      // Convert DTO to match Prisma type
      article = {
        ...noteDTO,
        createdAt: new Date(noteDTO.createdAt),
        updatedAt: new Date(noteDTO.updatedAt),
      } as any
    }
    catch {
      // Note not found, continue with null
    }
  }

  const noteTagsDTO = await fetchTags('NOTE')
  const noteTags = noteTagsDTO.map(t => ({ ...t, tagType: t.tagType as any }))
  const relatedArticleTagNames = article ? (article.tags ?? []).map((v: any) => v.tagName) : []

  return (
    <AdminArticleEditPage
      article={article}
      relatedArticleTagNames={relatedArticleTagNames}
      allTags={noteTags}
    />
  )
}
