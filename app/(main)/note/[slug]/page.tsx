import { fetchNoteHtmlBySlug } from '@/lib/api/note'
import ArticleDisplayPage from '@/components/shared/article-display-page'
import CommentCard from '@/components/shared/comment-card'
import HorizontalDividingLine from '@/components/shared/horizontal-dividing-line'
import ScrollIndicator from '@/components/shared/scroll-indicator'
import AskAiFloating from '@/components/shared/ask-ai-floating'
import { processor } from '@/lib/markdown'
import { notFound } from 'next/navigation'

export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const article = await fetchNoteHtmlBySlug((await params).slug)
    return {
      title: article.title,
    }
  }
  catch {
    notFound()
  }
}

export async function generateStaticParams() {
  // TODO: 从 Go API 获取所有已发布的笔记
  // 暂时返回空数组，后续需要实现
  return []
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  let article
  try {
    article = await fetchNoteHtmlBySlug((await params).slug)
  }
  catch {
    notFound()
  }

  if (!article)
    notFound()

  const { content, title, createdAt, tags, id } = article
  const htmlContent = String(await processor.process(content || ''))
  const tagNames = (tags || []).map(v => v.tagName)

  return (
    <div className="flex flex-col gap-4">
      <ArticleDisplayPage
        title={title}
        createdAt={createdAt}
        content={htmlContent}
        tags={tagNames}
      />
      <HorizontalDividingLine fill="#EC7FA9" />
      <CommentCard term={`${title}-note-${id}`} />
      <ScrollIndicator />
      <AskAiFloating title={title} tags={tagNames} />
    </div>
  )
}
