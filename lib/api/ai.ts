const API_BASE = process.env.NEXT_PUBLIC_GO_API_BASE || 'http://localhost:8080'
const AI_TIMEOUT_MS = 60_000 // 60 seconds for AI requests

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS)

  try {
    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      let errorMsg = `API error: ${response.status}`
      try {
        const errorData = await response.json()
        errorMsg = errorData.message || errorData.error || errorMsg
      }
      catch {
        const errorText = await response.text().catch(() => '')
        if (errorText)
          errorMsg = errorText
      }
      console.error('[AI API] Error response:', errorMsg)
      throw new Error(errorMsg)
    }

    return response.json()
  }
  catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.error('[AI API] Request timeout after', AI_TIMEOUT_MS, 'ms')
      throw new Error('Request Timeout')
    }
    throw err
  }
  finally {
    clearTimeout(timeout)
  }
}

export interface AiContext {
  title?: string
  tags?: string[]
}

export interface AskAiReq {
  question: string
  context?: AiContext
  provider?: 'openai' | 'deepseek' | 'glm' | 'qwen' | 'custom'
}

export interface AskAiResp {
  ok: boolean
  answer?: string
  message?: string
  provider?: string
}

/**
 * Ask AI a question
 */
export async function askAi(req: AskAiReq): Promise<AskAiResp> {
  return apiFetch<AskAiResp>('/api/ai/ask', {
    method: 'POST',
    body: JSON.stringify(req),
  })
}

/**
 * Stream AI answer chunks
 */
export async function askAiStream(
  req: AskAiReq,
  onChunk: (chunk: string) => void,
): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS)

  let fullText = ''

  try {
    const response = await fetch(`${API_BASE}/api/ai/ask?stream=1`, {
      method: 'POST',
      body: JSON.stringify(req),
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
    })

    if (!response.ok) {
      let errorMsg = `API error: ${response.status}`
      try {
        const errorData = await response.json()
        errorMsg = errorData.message || errorData.error || errorMsg
      }
      catch {
        const errorText = await response.text().catch(() => '')
        if (errorText)
          errorMsg = errorText
      }
      throw new Error(errorMsg)
    }

    if (!response.body) {
      throw new Error('Stream not supported in this environment')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done)
        break

      buffer += decoder.decode(value, { stream: true })
      const parts = buffer.split('\n\n')
      buffer = parts.pop() || ''

      for (const part of parts) {
        const line = part.trim()
        if (!line.startsWith('data:'))
          continue
        const data = line.slice(5).trim()
        if (!data || data === '[DONE]')
          continue
        if (data.startsWith('[ERROR]')) {
          throw new Error(data.replace('[ERROR]', '').trim() || 'AI stream error')
        }
        fullText += data
        onChunk(data)
      }
    }

    return fullText
  }
  catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request Timeout')
    }
    throw err
  }
  finally {
    clearTimeout(timeout)
  }
}
