import type { TagType } from '@prisma/client'
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
import { deleteTag } from '@/lib/api/tag'
import { useModalStore } from '@/store/use-modal-store'

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
    onSuccess: () => {
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
      <DialogContent className="paper-card-strong gap-0 rounded-[28px] border-white/80 bg-[#f8f5f0]/95 p-6 text-center shadow-[0_28px_90px_-48px_rgba(41,66,69,0.52)] dark:border-white/12 dark:bg-[#10191b]/95 sm:max-w-[460px]">
        <DialogHeader className="space-y-3">
          <span className="paper-label mx-auto">delete tag</span>
          <DialogTitle className="paper-title text-3xl">删除标签</DialogTitle>
          <DialogDescription className="text-sm leading-7 text-foreground/60">
            删除后只会断开与文章的关联，不会删除文章内容本身。
          </DialogDescription>
        </DialogHeader>
        <div className="paper-card mt-6 rounded-[22px] px-4 py-4 text-left">
          <p className="text-xs uppercase tracking-[0.22em] text-foreground/42">Tag</p>
          <p className="paper-title mt-3 text-2xl">{values?.tagName ?? '未命名标签'}</p>
          <p className="mt-2 text-sm text-foreground/56">{values?.tagType ?? 'UNKNOWN'}</p>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <Button
            onClick={onSubmit}
            variant="destructive"
            className="cursor-pointer rounded-full px-6"
            disabled={isPending}
            type="submit"
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
