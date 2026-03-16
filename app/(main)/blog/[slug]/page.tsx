import ArticleDisplayPage from '@/components/shared/article-display-page'
import AskAiFloating from '@/components/shared/ask-ai-floating'
import CommentCard from '@/components/shared/comment-card'
import HorizontalDividingLine from '@/components/shared/horizontal-dividing-line'
import ScrollIndicator from '@/components/shared/scroll-indicator'
import { fetchBlogHtmlBySlug } from '@/lib/api/blog'
import { processor } from '@/lib/markdown'
import { notFound } from 'next/navigation'

export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const article = await fetchBlogHtmlBySlug((await params).slug)
    return {
      title: article.title,
    }
  }
  catch {
    notFound()
  }
}

export async function generateStaticParams() {
  // TODO: 从 Go API 获取所有已发布的博客
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
    article = await fetchBlogHtmlBySlug((await params).slug)
  }
  catch {
    notFound()
  }

  if (!article)
    notFound()

  const { content, title, createdAt, tags, id } = article
  const htmlContent = String(await processor.process(content || ''))
  const tagNames = (tags || []).map(v => v.tagName)
  const articleDate = new Date(createdAt)

  return (
    <div className="flex flex-col gap-6">
      <ArticleDisplayPage
        title={title}
        createdAt={articleDate}
        content={htmlContent}
        tags={tagNames}
      />
      <section className="paper-card px-5 py-6 md:px-8 md:py-7">
        <HorizontalDividingLine fill="#57b8ab" />
        <div className="mt-6">
          <CommentCard term={`${title}-blog-${id}`} />
        </div>
      </section>
      <ScrollIndicator />
      <AskAiFloating title={title} tags={tagNames} />
    </div>
  )
}
