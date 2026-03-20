import { TagType } from '@prisma/client'
import { Edit2, Eye, Trash } from 'lucide-react'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useModalStore } from '@/store/use-modal-store'

export default function ActionButtons({
  noteId,
  slug,
  title,
}: {
  noteId: number
  slug: string
  title: string
}) {
  const { setModalOpen } = useModalStore()
  const iconButtonClass = 'glass-icon-button size-9'

  return (
    <section className="flex items-center gap-2">
      <Link
        href={`/note/${slug}`}
        prefetch={false}
        className={cn(
          buttonVariants({ variant: 'outline', className: iconButtonClass }),
        )}
      >
        <Eye className="size-4" />
      </Link>

      <Link
        href={`note/edit/${slug}`}
        className={cn(
          buttonVariants({ variant: 'outline', className: iconButtonClass }),
        )}
      >
        <Edit2 className="size-4" />
      </Link>

      <Button
        variant="outline"
        className={`${iconButtonClass} cursor-pointer text-red-600`}
        onClick={() => {
          setModalOpen('deleteArticleModal', {
            id: noteId,
            title,
            articleType: TagType.NOTE,
          })
        }}
      >
        <Trash className="size-4" />
      </Button>
    </section>
  )
}
