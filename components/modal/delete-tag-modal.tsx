import { deleteTag } from '@/lib/api/tag'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useModalStore } from '@/store/use-modal-store'
import { TagType } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface DeleteTagDTO {
  id: number
  tagName: string
  tagType: TagType
}

export default function DeleteTagModal() {
  const { modalType, payload, onModalClose } = useModalStore()
  const isModalOpen = modalType === 'deleteTagModal'
  const values = payload
    ? (payload as DeleteTagDTO)
    : null

  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: (id: number) => deleteTag(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success(`删除标签成功`)
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(`删除标签失败~ ${error.message}`)
      }
      else {
        toast.error(`删除标签出错~`)
      }
    },
  })

  async function onSubmit() {
    if (!values) {
      toast.error(`标签信息不存在，删除出错`)
      return
    }
    mutate(values.id)
    onModalClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="flex flex-col items-center gap-4">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle>确定要删除该标签吗🥹</DialogTitle>
          <DialogDescription>
            不会删除关联的所有文章哦, 只是断开标签和文章的连接
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4">
          <Button
            onClick={onSubmit}
            variant="destructive"
            className="cursor-pointer"
            disabled={isPending}
            type="submit"
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
