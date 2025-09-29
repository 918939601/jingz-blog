import Link from 'next/link'
import ScaleUnderline from '@/components/shared/scale-underline'
import { toZhDay } from '@/lib/time'

export default function BlogListItem({
  blogTitle,
  createdAt,
  slug,
}: {
  blogTitle: string
  createdAt: Date
  slug: string
}) {
  return (
    <Link
      href={`blog/${slug}`}
      className="flex items-center justify-between gap-10 p-2 cursor-pointer
                hover:text-purple-600
                dark:hover:text-emerald-300 rounded-sm duration-500 group"
    >
      <h2 className="relative truncate group">
        {blogTitle}
        <ScaleUnderline className="dark:bg-emerald-300 bg-purple-600" />
      </h2>
      <time className="shrink-0 text-sm font-light text-gray-400 dark:group-hover:text-emerald-300 group-hover:text-purple-600">
        {toZhDay(createdAt)}
      </time>
    </Link>
  )
}
