export async function apiFetch<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const base = process.env.NEXT_PUBLIC_GO_API_BASE || process.env.GO_API_BASE
  if (!base)
    throw new Error('GO_API_BASE is not configured')

  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')

  // TODO: 从 NextAuth session 或 cookies 读取外部 Bearer Token 并注入
  // const token = await getExternalBearerToken()
  // if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(`${base}${path}`.replace(/\/+$/, '').replace(/([^:])\/\//g, '$1/'), {
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
