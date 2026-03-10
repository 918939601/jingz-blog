import { Button } from '@/components/ui/button'
import { useModalStore } from '@/store/use-modal-store'
import { Edit2, Trash } from 'lucide-react'

export default function ActionButtons({
  id,
  content,
  isPublished,
  reference,
}: {
  id: number
  content: string
  isPublished: boolean
  reference: string
}) {
  const { setModalOpen } = useModalStore()

  return (
    <section className="flex items-center gap-1">
      <Button
        variant="outline"
        className="size-8 cursor-pointer"
        onClick={() => {
          setModalOpen('editEchoModal', {
            id,
            content,
            isPublished,
            reference,
          })
        }}
      >
        <Edit2 className="size-4" />
      </Button>
      <Button
        variant="outline"
        className="size-8 text-red-600 cursor-pointer"
        onClick={() => {
          setModalOpen('deleteEchoModal', {
            id,
          })
        }}
      >
        <Trash />
      </Button>
    </section>
  )
}
