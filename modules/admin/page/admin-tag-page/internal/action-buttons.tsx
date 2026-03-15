import type { TagType } from '@prisma/client'
import { Edit2, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useModalStore } from '@/store/use-modal-store'

export default function ActionButtons({
  id,
  tagName,
  tagType,
}: {
  id: number
  tagName: string
  tagType: TagType
}) {
  const { setModalOpen } = useModalStore()
  const iconButtonClass = 'glass-icon-button size-9 cursor-pointer'

  return (
    <section className="flex items-center gap-2">
      <Button
        variant="outline"
        className={iconButtonClass}
        onClick={() =>
          setModalOpen('editTagModal', {
            id,
            tagName,
            tagType,
          })}
      >
        <Edit2 className="size-4" />
      </Button>

      <Button
        variant="outline"
        className={`${iconButtonClass} text-red-600`}
        onClick={() => {
          setModalOpen('deleteTagModal', {
            id,
            tagName,
            tagType,
          })
        }}
      >
        <Trash className="size-4" />
      </Button>
    </section>
  )
}
