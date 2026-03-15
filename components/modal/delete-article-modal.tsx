import { TagType } from '@prisma/client'
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
import { deleteBlog } from '@/lib/api/blog'
import { deleteNote } from '@/lib/api/note'
import { useModalStore } from '@/store/use-modal-store'

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
    mutationFn: async (params: { id: number, articleType: TagType }) => {
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
      <DialogContent className="paper-card-strong gap-0 rounded-[28px] border-white/80 bg-[#f8f5f0]/95 p-6 text-center shadow-[0_28px_90px_-48px_rgba(41,66,69,0.52)] dark:border-white/12 dark:bg-[#10191b]/95 sm:max-w-[500px]">
        <DialogHeader className="space-y-3">
          <span className="paper-label mx-auto">delete article</span>
          <DialogTitle className="paper-title text-3xl">删除文章</DialogTitle>
          <DialogDescription className="text-sm leading-7 text-foreground/60">
            这是永久删除操作，文章内容和关联信息都会被移除。
          </DialogDescription>
        </DialogHeader>
        <div className="paper-card mt-6 rounded-[22px] px-4 py-4 text-left">
          <p className="text-xs uppercase tracking-[0.22em] text-foreground/42">Article</p>
          <p className="paper-title mt-3 line-clamp-2 text-2xl">{title ?? '未命名内容'}</p>
          <p className="mt-2 text-sm text-foreground/56">{articleType ?? 'UNKNOWN'}</p>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <Button
            variant="destructive"
            className="cursor-pointer rounded-full px-6"
            type="submit"
            onClick={onSubmit}
            disabled={isPending}
          >
            {isPending ? '删除中...' : '确定'}
          </Button>
          <Button variant="outline" onClick={onModalClose} className="rounded-full px-6">
            取消
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
