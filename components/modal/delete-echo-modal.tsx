import { deleteEcho } from '@/lib/api/echo'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useModalStore } from '@/store/use-modal-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export default function DeleteEchoModal() {
  const { modalType, payload, onModalClose } = useModalStore()
  const isModalOpen = modalType === 'deleteEchoModal'
  const { id } = payload
    ? (payload as { id: number })
    : {}

  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: async (id: number) => {
      return deleteEcho(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['echo-list'] })
      toast.success(`删除成功`)
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(`删除失败${error.message}`)
      }
      else {
        toast.error(`删除失败`)
      }
    },
  })

  async function onSubmit() {
    if (!id) {
      toast.error(`标签信息不存在，删除失败`)
      return
    }
    mutate(id)
    onModalClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="flex flex-col items-center gap-4">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle>确定要删除这个引用吗🥹</DialogTitle>
          <DialogDescription>真的会直接删除的喵🥹</DialogDescription>
        </DialogHeader>
        <div className="flex gap-4">
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={onSubmit}
            disabled={isPending}
          >
            确定
          </Button>
          <Button variant="outline" onClick={onModalClose}>
            取消
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
