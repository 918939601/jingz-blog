'use client'

import { useState } from 'react'
import { askAiStream } from '@/lib/api/ai'

interface AskAiCardProps {
  title?: string
  tags?: string[]
  showHeader?: boolean
}

export default function AskAiCard({ title, tags = [], showHeader = true }: AskAiCardProps) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isComposing, setIsComposing] = useState(false)

  const handleAsk = async () => {
    const q = question.trim()
    if (!q) return

    console.log('[AI Frontend] Starting request, question:', q)
    setIsLoading(true)
    setError(null)
    setAnswer('')

    try {
      console.log('[AI Frontend] Calling askAi stream API...')
      await askAiStream(
        {
          question: q,
          context: {
            title,
            tags,
          },
        },
        chunk => {
          setAnswer(prev => prev + chunk)
        },
      )
      console.log('[AI Frontend] Stream completed')
    }
    catch (err) {
      console.error('[AI Frontend] Error:', err)
      setError((err as Error).message || '请求失败')
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleAsk()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Don't submit if user is composing (e.g., using Chinese input method)
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleAsk()
    }
  }

  return (
    <section className="rounded-2xl border border-purple-200/70 bg-white/60 p-4 shadow-sm backdrop-blur dark:border-emerald-300/30 dark:bg-slate-900/40">
      {showHeader && (
        <div className="flex items-center gap-2 text-sm font-semibold text-purple-700 dark:text-emerald-200">
          <span className="rounded-full border border-purple-300/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide dark:border-emerald-200/50">
            AI
          </span>
          <span>问问 AI</span>
          <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
            看不懂的概念，直接问
          </span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder="例如：大模型是什么？深度学习和机器学习有什么区别？（Enter 提交，Shift+Enter 换行）"
          rows={3}
          className="w-full rounded-xl border border-purple-200/70 bg-white/80 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:border-emerald-200/40 dark:bg-slate-950/60 dark:text-gray-100 dark:focus:border-emerald-300 dark:focus:ring-emerald-200/30"
        />
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg border border-purple-300/80 px-4 py-2 text-sm font-semibold text-purple-700 transition hover:-translate-y-0.5 hover:border-purple-500 hover:text-purple-800 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-70 dark:border-emerald-200/40 dark:text-emerald-200 dark:hover:border-emerald-200"
          >
            {isLoading ? '思考中…' : '提问'}
          </button>
          <button
            type="button"
            onClick={() => {
              setQuestion('')
              setAnswer('')
              setError(null)
            }}
            className="text-xs text-gray-500 transition hover:text-purple-600 dark:text-gray-400 dark:hover:text-emerald-200"
          >
            清空
          </button>
        </div>
      </form>
      {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
      {answer && (
        <div className="mt-3 rounded-xl border border-purple-100/80 bg-white/80 p-3 text-sm leading-relaxed text-gray-800 shadow-inner dark:border-emerald-200/30 dark:bg-slate-950/60 dark:text-gray-100">
          {answer}
        </div>
      )}
    </section>
  )
}
