import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { fetchNoteBySlug } from '@/lib/api/note'
import { toZhDay } from '@/lib/time'

export default function NoteListItem({
  noteTitle,
  createdAt,
  slug,
}: {
  noteTitle: string
  createdAt: Date
  slug: string
}) {
  const queryClient = useQueryClient()

  const handleMouseEnter = () => {
    // 预加载笔记详情
    queryClient.prefetchQuery({
      queryKey: ['note', slug],
      queryFn: () => fetchNoteBySlug(slug),
      staleTime: 1000 * 60 * 5,
    })
  }

  return (
    <Link
      href={`/note/${slug}`}
      onMouseEnter={handleMouseEnter}
      className="group paper-card flex items-center justify-between gap-4 p-5 transition-transform duration-300 hover:-translate-y-1 md:p-6"
    >
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.24em] text-foreground/40">
          note
        </p>
        <h2 className="paper-title mt-2 truncate text-xl transition-colors group-hover:text-primary md:text-2xl">
          {noteTitle}
        </h2>
      </div>
      <time className="shrink-0 text-sm text-foreground/46 transition-colors group-hover:text-primary">
        {toZhDay(createdAt)}
      </time>
    </Link>
  )
}
