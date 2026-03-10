import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret')

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ code: 'UNAUTHORIZED', message: 'invalid secret' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  }
  catch {
    return NextResponse.json({ code: 'INVALID_BODY', message: 'invalid json' }, { status: 400 })
  }

  const paths = (body as { paths?: unknown }).paths

  if (!Array.isArray(paths) || paths.length === 0) {
    return NextResponse.json({ code: 'INVALID_BODY', message: 'paths required' }, { status: 400 })
  }

  for (const p of paths) {
    if (typeof p === 'string' && p.startsWith('/')) {
      revalidatePath(p)
    }
  }

  return NextResponse.json({ revalidated: true })
}



