import AdminArticleEditPage from '@/components/shared/admin-article-edit-page'
import { fetchNoteBySlug } from '@/lib/api/note'
import { fetchTags } from '@/lib/api/tag'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] | undefined }>
}) {
  const slug = (await params).slug?.[0] ?? null

  let article = null
  const articlePromise = slug
    ? fetchNoteBySlug(slug).catch(() => null)
    : Promise.resolve(null)
  const noteTagsPromise = fetchTags('NOTE')

  const [noteDTO, noteTagsDTO] = await Promise.all([articlePromise, noteTagsPromise])

  if (noteDTO) {
    try {
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
