'use client'

import { useState } from 'react'
import { askAiStream } from '@/lib/api/ai'

interface AskAiCardProps {
  title?: string
  tags?: string[]
  showHeader?: boolean
}

const EMPTY_TAGS: string[] = []

export default function AskAiCard({ title, tags, showHeader = true }: AskAiCardProps) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isComposing, setIsComposing] = useState(false)
  const contextTags = tags ?? EMPTY_TAGS

  const handleAsk = async () => {
    const q = question.trim()
    if (!q) {
      return
    }

    setIsLoading(true)
    setError(null)
    setAnswer('')

    try {
      await askAiStream(
        {
          question: q,
          context: {
            title,
            tags: contextTags,
          },
        },
        (chunk) => {
          setAnswer(prev => prev + chunk)
        },
      )
    }
    catch (err) {
      console.error('Ask AI failed:', err)
      setError((err as Error).message || '请求失败')
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void handleAsk()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      void handleAsk()
    }
  }

  return (
    <section className="flex h-full flex-col rounded-[28px] border border-black/6 bg-black/[0.03] p-4 dark:border-white/10 dark:bg-white/[0.03]">
      {showHeader && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="paper-label !px-2.5 !py-1 !tracking-[0.22em]">
            AI
          </span>
          <span className="text-sm font-semibold text-foreground">问问 AI</span>
          <span className="text-xs text-foreground/48">看不懂的概念，直接问</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder="例如：这篇文章里提到的概念是什么意思？Enter 提交，Shift + Enter 换行。"
          rows={4}
          className="min-h-28 w-full rounded-[22px] border border-white/80 bg-white/82 px-4 py-3 text-sm leading-7 text-foreground outline-none transition focus:border-[#57b8ab] focus:ring-2 focus:ring-[#57b8ab]/20 dark:border-white/12 dark:bg-white/[0.06] dark:focus:border-[#57b8ab] dark:focus:ring-[#57b8ab]/20"
        />
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="rounded-full border border-white/85 bg-white/82 px-4 py-2 text-sm font-semibold text-primary transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/12 dark:bg-white/[0.06] dark:text-primary"
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
            className="text-xs text-foreground/48 transition hover:text-primary"
          >
            清空
          </button>
        </div>
      </form>

      {!!contextTags.length && (
        <div className="mt-3 flex flex-wrap gap-2">
          {contextTags.map(tag => (
            <span
              key={tag}
              className="rounded-full border border-black/6 bg-black/[0.03] px-3 py-1 text-xs text-foreground/56 dark:border-white/10 dark:bg-white/[0.03]"
            >
              {`#${tag}`}
            </span>
          ))}
        </div>
      )}

      {error && <p className="mt-3 text-xs text-red-500 dark:text-red-300">{error}</p>}

      <div className="mt-4 min-h-0 flex-1">
        {answer
          ? (
              <div className="h-full rounded-[22px] border border-white/80 bg-white/84 p-4 text-sm leading-7 text-foreground shadow-inner dark:border-white/12 dark:bg-white/[0.06]">
                <div className="h-full overflow-y-auto whitespace-pre-wrap">
                  {answer}
                </div>
              </div>
            )
          : (
              <div className="flex h-full min-h-32 items-center justify-center rounded-[22px] border border-dashed border-black/8 px-4 text-center text-sm leading-7 text-foreground/42 dark:border-white/10">
                {title
                  ? `可以围绕《${title}》提问，也可以直接问一个技术概念。`
                  : '输入一个问题开始。'}
              </div>
            )}
      </div>
    </section>
  )
}
