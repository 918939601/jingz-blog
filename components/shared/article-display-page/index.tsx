import { customMarkdownTheme } from '@/lib/markdown'
import * as motion from 'motion/react-client'
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
    <div className="min-h-screen backdrop-blur-[1px] z-10">
      <motion.article
        className="flex flex-col gap-4 py-2 px-6 max-w-3xl flex-1 dark:bg-gray-900/30 bg-slate-300/30 rounded-sm
                    border border-dashed border-indigo-200 dark:border-accent"
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
        {/* 渲染的主要内容 */}
        <main
          className={customMarkdownTheme}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </motion.article>
    </div>
  )
}
