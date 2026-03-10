const API_BASE = process.env.NEXT_PUBLIC_GO_API_BASE || 'http://localhost:8080'

export interface EchoDTO {
  id: number
  reference: string
  content: string
  isPublished: boolean
  createdAt: string
}

export interface EchoListResponse {
  items: EchoDTO[]
  total: number
  page: number
  pageSize: number
}

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

export async function fetchEchos(params: { query?: string; page?: number; pageSize?: number } = {}) {
  const q = new URLSearchParams()
  if (params.query) q.set('query', params.query)
  if (params.page) q.set('page', String(params.page))
  if (params.pageSize) q.set('pageSize', String(params.pageSize))
  const qs = q.toString()
  return apiFetch<EchoListResponse>(`/api/echos${qs ? `?${qs}` : ''}`)
}

export async function fetchPublishedEchos() {
  return apiFetch<EchoDTO[]>(`/api/echos/published`)
}

export async function createEcho(body: { reference: string; content: string; isPublished?: boolean }) {
  return apiFetch<EchoDTO>(`/api/echos`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateEcho(id: number, body: Partial<Pick<EchoDTO, 'reference' | 'content' | 'isPublished'>>) {
  return apiFetch<EchoDTO>(`/api/echos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function toggleEchoPublished(id: number, isPublished: boolean) {
  return apiFetch<EchoDTO>(`/api/echos/${id}/publish`, {
    method: 'PATCH',
    body: JSON.stringify({ isPublished }),
  })
}

export async function deleteEcho(id: number) {
  return apiFetch<void>(`/api/echos/${id}`, { method: 'DELETE' })
}


