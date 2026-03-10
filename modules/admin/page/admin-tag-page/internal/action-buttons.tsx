import type { TagType } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { useModalStore } from '@/store/use-modal-store'
import { Edit2, Trash } from 'lucide-react'

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

  return (
    <section className="flex items-center gap-1">
      <Button
        variant="outline"
        className="size-8 cursor-pointer"
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
        className="size-8 text-red-600"
        onClick={() => {
          setModalOpen('deleteTagModal', {
            id,
            tagName,
            tagType,
          })
        }}
      >
        <Trash />
      </Button>
    </section>
  )
}
