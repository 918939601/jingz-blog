import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { deleteEcho } from '@/lib/api/echo'
import { useModalStore } from '@/store/use-modal-store'

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
      <DialogContent className="paper-card-strong gap-0 rounded-[28px] border-white/80 bg-[#f8f5f0]/95 p-6 text-center shadow-[0_28px_90px_-48px_rgba(41,66,69,0.52)] dark:border-white/12 dark:bg-[#10191b]/95 sm:max-w-[460px]">
        <DialogHeader className="space-y-3">
          <span className="paper-label mx-auto">delete echo</span>
          <DialogTitle className="paper-title text-3xl">删除引用</DialogTitle>
          <DialogDescription className="text-sm leading-7 text-foreground/60">
            这是永久删除操作，确认后该引用无法恢复。
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 flex justify-center gap-3">
          <Button
            variant="destructive"
            className="cursor-pointer rounded-full px-6"
            onClick={onSubmit}
            disabled={isPending}
          >
            {isPending ? '删除中...' : '确认删除'}
          </Button>
          <Button variant="outline" onClick={onModalClose} className="rounded-full px-6">
            取消
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
