import { apiFetch } from './client'

export interface TagDTO {
  id: number
  tagName: string
  tagType: string
}

export async function fetchTags(tagType?: string) {
  const params = new URLSearchParams()
  if (tagType)
    params.set('tagType', tagType)

  const qs = params.toString()
  return apiFetch<TagDTO[]>(`/api/tags${qs ? `?${qs}` : ''}`)
}

export async function createTag(body: { tagName: string, tagType: string }) {
  return apiFetch<TagDTO>(`/api/tags`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateTag(id: number, body: { tagName: string }) {
  return apiFetch<TagDTO>(`/api/tags/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function deleteTag(id: number) {
  return apiFetch<void>(`/api/tags/${id}`, { method: 'DELETE' })
}
