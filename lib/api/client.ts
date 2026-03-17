const LOCAL_API_BASE = 'http://localhost:8080'

export function getApiBase() {
  if (typeof window !== 'undefined')
    return process.env.NEXT_PUBLIC_GO_API_BASE || '/goapi'

  return process.env.GO_API_BASE || process.env.NEXT_PUBLIC_GO_API_BASE || LOCAL_API_BASE
}

export function buildApiUrl(path: string) {
  const base = getApiBase().replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalizedPath}`.replace(/([^:])\/{2,}/g, '$1/')
}

export async function apiFetch<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const url = buildApiUrl(path)

  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')

  // TODO: 从 NextAuth session 或 cookies 读取外部 Bearer Token 并注入
  // const token = await getExternalBearerToken()
  // if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(url, {
    ...init,
    headers,
    cache: 'no-store',
  })

  if (!res.ok) {
    let err: any
    try {
      err = await res.json()
    }
    catch {
      err = { message: res.statusText }
    }

    throw new Error(err?.message ?? 'Request failed')
  }
  if (res.status === 204)
    return null as T
  return await res.json() as T
}
