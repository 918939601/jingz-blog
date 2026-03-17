import { apiFetch } from './client'

export interface NoteDTO {
  id: number
  slug: string
  title: string
  content: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
  tags?: Array<{
    id: number
    tagName: string
    tagType: string
  }>
}

export interface NoteListResponse {
  items: NoteDTO[]
  total: number
  page: number
  pageSize: number
}

export async function fetchNotes(params: {
  query?: string
  tags?: string
  page?: number
  pageSize?: number
} = {}) {
  const q = new URLSearchParams()
  if (params.query)
    q.set('query', params.query)
  if (params.tags)
    q.set('tags', params.tags)
  if (params.page)
    q.set('page', String(params.page))
  if (params.pageSize)
    q.set('pageSize', String(params.pageSize))
  const qs = q.toString()
  return apiFetch<NoteListResponse>(`/api/notes${qs ? `?${qs}` : ''}`)
}

export async function fetchNoteBySlug(slug: string) {
  return apiFetch<NoteDTO>(`/api/notes/${slug}`)
}

export async function fetchNoteHtmlBySlug(slug: string) {
  return apiFetch<NoteDTO>(`/api/notes/${slug}/html`)
}

export async function createNote(body: {
  slug: string
  title: string
  content: string
  isPublished: boolean
  relatedTagNames?: string[]
}) {
  return apiFetch<NoteDTO>(`/api/notes`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateNote(
  id: number,
  body: Partial<{
    slug: string
    title: string
    content: string
    isPublished: boolean
    relatedTagNames: string[]
  }>,
) {
  return apiFetch<NoteDTO>(`/api/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function toggleNotePublished(id: number, isPublished: boolean) {
  return apiFetch<NoteDTO>(`/api/notes/${id}/publish`, {
    method: 'PATCH',
    body: JSON.stringify({ isPublished }),
  })
}

export async function deleteNote(id: number) {
  return apiFetch<void>(`/api/notes/${id}`, { method: 'DELETE' })
}
