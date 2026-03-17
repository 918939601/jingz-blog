import { notFound } from 'next/navigation'
import ArticleDisplayPage from '@/components/shared/article-display-page'
import AskAiFloating from '@/components/shared/ask-ai-floating'
import CommentCard from '@/components/shared/comment-card'
import HorizontalDividingLine from '@/components/shared/horizontal-dividing-line'
import ScrollIndicator from '@/components/shared/scroll-indicator'
import { getCachedNotePageData } from '@/lib/article-page-data'

export const dynamicParams = true
export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const article = await getCachedNotePageData((await params).slug)
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
    article = await getCachedNotePageData((await params).slug)
  }
  catch {
    notFound()
  }

  if (!article)
    notFound()

  const { htmlContent, title, createdAt, tags, id } = article
  const articleDate = new Date(createdAt)

  return (
    <div className="flex flex-col gap-6">
      <ArticleDisplayPage
        title={title}
        createdAt={articleDate}
        content={htmlContent}
        tags={tags}
      />
      <section className="paper-card px-5 py-6 md:px-8 md:py-7">
        <HorizontalDividingLine fill="#57b8ab" />
        <div className="mt-6">
          <CommentCard term={`${title}-note-${id}`} />
        </div>
      </section>
      <ScrollIndicator />
      <AskAiFloating title={title} tags={tags} />
    </div>
  )
}
