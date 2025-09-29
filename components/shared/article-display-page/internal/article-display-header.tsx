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
    <header className="flex flex-col justify-center items-center gap-1">
      <h1 className="text-3xl md:text-4xl font-extrabold text-purple-600 dark:text-emerald-300">
        {title}
      </h1>

      <section className="flex justify-center w-full gap-2 text-xs md:text-sm">

        <p className="flex gap-2 justify-center">
          {tags.map(tag => (
            <TagItemBadge
              key={`${tag.toString()}`}
              tag={tag}
            />
          ))}
        </p>

        <time className="border-b border-dashed border-b-foreground">{toZhDay(createdAt)}</time>
      </section>

    </header>
  )
}
