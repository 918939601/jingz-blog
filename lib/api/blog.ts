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

export interface BlogDTO {
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

export interface BlogListResponse {
  items: BlogDTO[]
  total: number
  page: number
  pageSize: number
}

export async function fetchBlogs(params: {
  query?: string
  tags?: string
  published?: number
  page?: number
  pageSize?: number
} = {}) {
  const q = new URLSearchParams()
  if (params.query)
    q.set('query', params.query)
  if (params.tags)
    q.set('tags', params.tags)
  if (params.published !== undefined)
    q.set('published', String(params.published))
  if (params.page)
    q.set('page', String(params.page))
  if (params.pageSize)
    q.set('pageSize', String(params.pageSize))
  const qs = q.toString()
  return apiFetch<BlogListResponse>(`/api/blogs${qs ? `?${qs}` : ''}`)
}

export async function fetchBlogBySlug(slug: string) {
  return apiFetch<BlogDTO>(`/api/blogs/${slug}`)
}

export async function fetchBlogHtmlBySlug(slug: string) {
  return apiFetch<BlogDTO>(`/api/blogs/${slug}/html`)
}

export async function createBlog(body: {
  slug: string
  title: string
  content: string
  isPublished: boolean
  relatedTagNames?: string[]
}) {
  return apiFetch<BlogDTO>(`/api/blogs`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateBlog(
  id: number,
  body: Partial<{
    slug: string
    title: string
    content: string
    isPublished: boolean
    relatedTagNames: string[]
  }>,
) {
  return apiFetch<BlogDTO>(`/api/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function toggleBlogPublished(id: number, isPublished: boolean) {
  return apiFetch<BlogDTO>(`/api/blogs/${id}/publish`, {
    method: 'PATCH',
    body: JSON.stringify({ isPublished }),
  })
}

export async function deleteBlog(id: number) {
  return apiFetch<void>(`/api/blogs/${id}`, { method: 'DELETE' })
}
