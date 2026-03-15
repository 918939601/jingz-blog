import * as motion from 'motion/react-client'
import { customMarkdownTheme } from '@/lib/markdown'
import ArticleDisplayHeader from './internal/article-display-header'

export default function ArticleDisplayPage({
  title,
  createdAt,
  tags,
  content,
}: {
  title: string
  content: string
  createdAt: Date
  tags: string[]
}) {
  return (
    <div className="z-10">
      <motion.article
        className="paper-card-strong mx-auto flex w-full max-w-4xl flex-col gap-6 px-5 py-6 md:px-8 md:py-8"
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: [30, -2, 0],
        }}
        transition={{
          type: 'tween',
          ease: 'easeInOut',
          duration: 0.8,
        }}
      >
        <ArticleDisplayHeader title={title} createdAt={createdAt} tags={tags} />
        <main
          className={`${customMarkdownTheme} min-w-0`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </motion.article>
    </div>
  )
}
