const API_BASE = process.env.NEXT_PUBLIC_GO_API_BASE || 'http://localhost:8080'

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || `API error: ${response.status}`)
  }

  return response.json()
}

export interface TagDTO {
  id: number
  tagName: string
  tagType: string
}

export async function fetchTags(tagType?: string) {
  const params = new URLSearchParams()
  if (tagType) params.set('tagType', tagType)
  const qs = params.toString()
  return apiFetch<TagDTO[]>(`/api/tags${qs ? `?${qs}` : ''}`)
}

export async function createTag(body: { tagName: string; tagType: string }) {
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
