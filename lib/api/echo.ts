import { apiFetch } from './client'

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

export async function fetchEchos(params: { query?: string, page?: number, pageSize?: number } = {}) {
  const q = new URLSearchParams()
  if (params.query)
    q.set('query', params.query)
  if (params.page)
    q.set('page', String(params.page))
  if (params.pageSize)
    q.set('pageSize', String(params.pageSize))
  const qs = q.toString()
  return apiFetch<EchoListResponse>(`/api/echos${qs ? `?${qs}` : ''}`)
}

export async function fetchPublishedEchos() {
  return apiFetch<EchoDTO[]>(`/api/echos/published`)
}

export async function createEcho(body: { reference: string, content: string, isPublished?: boolean }) {
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
