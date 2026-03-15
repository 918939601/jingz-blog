import TagItemBadge from '@/components/shared/tag-item-badge'
import { toZhDay } from '@/lib/time'

export default function ArticleDisplayHeader({
  title,
  createdAt,
  tags,
}: {
  title: string
  createdAt: Date
  tags: string[]
}) {
  return (
    <header className="flex flex-col gap-5 border-b border-black/8 pb-6 dark:border-white/10">
      <div className="flex flex-wrap gap-2">
        <span className="paper-label">essay</span>
        <time className="paper-label !tracking-[0.18em]">{toZhDay(createdAt)}</time>
      </div>

      <h1 className="paper-title text-4xl leading-tight md:text-5xl">
        {title}
      </h1>

      <section className="flex flex-wrap gap-2 text-xs md:text-sm">
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <TagItemBadge
              key={`${tag.toString()}`}
              tag={tag}
            />
          ))}
        </div>
      </section>
    </header>
  )
}
