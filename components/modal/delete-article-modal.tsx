import { deleteBlog } from '@/lib/api/blog'
import { deleteNote } from '@/lib/api/note'
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

interface DeleteArticleParams {
  id: number
  title: string
  articleType: TagType
}

export default function DeleteArticleModal() {
  const { modalType, payload, onModalClose } = useModalStore()
  const isModalOpen = modalType === 'deleteArticleModal'
  const { id, title, articleType } = payload ? (payload as DeleteArticleParams) : {}

  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: async (params: { id: number; articleType: TagType }) => {
      switch (params.articleType) {
        case TagType.BLOG:
          return await deleteBlog(params.id)
        case TagType.NOTE:
          return await deleteNote(params.id)
        default:
          throw new Error(`文章类型不正确`)
      }
    },
    onSuccess: () => {
      toast.success(`删除文章成功`)
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      if (articleType === TagType.BLOG) {
        queryClient.invalidateQueries({ queryKey: ['blog-list'] })
      }
      else if (articleType === TagType.NOTE) {
        queryClient.invalidateQueries({ queryKey: ['note-list'] })
      }
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(`删除文章失败~ ${error.message}`)
      }
      else {
        toast.error(`删除文章出错~`)
      }
    },
  })

  async function onSubmit() {
    if (!id || !articleType || !title) {
      return
    }
    mutate({ id, articleType })
    onModalClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="flex flex-col items-center gap-4">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle>确定要删除这篇文章吗🥹</DialogTitle>
          <DialogDescription>真的会直接删除的喵🥹</DialogDescription>
        </DialogHeader>
        <div className="flex gap-4">
          <Button
            variant="destructive"
            className="cursor-pointer"
            type="submit"
            onClick={onSubmit}
            disabled={isPending}
          >
            {isPending ? '删除中...' : '确定'}
          </Button>
          <Button variant="outline" onClick={onModalClose}>
            取消
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
