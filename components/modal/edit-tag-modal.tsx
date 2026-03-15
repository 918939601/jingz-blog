'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { updateTag } from '@/lib/api/tag'
import { useModalStore } from '@/store/use-modal-store'

const UpdateTagNameSchema = z.object({
  id: z.number(),
  tagName: z.string().min(1, '标签名不能为空'),
})

type UpdateTagNameDTO = z.infer<typeof UpdateTagNameSchema>

export default function EditTagModal() {
  const { modalType, onModalClose, payload } = useModalStore()
  const isModalOpen = modalType === 'editTagModal'
  const { id, tagName } = payload
    ? (payload as { id: number, tagName: string })
    : {}

  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: (values: UpdateTagNameDTO) => updateTag(values.id, { tagName: values.tagName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success(`修改成功`)
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(`修改标签出错 ${error.message}`)
      }
      else {
        toast.error(`修改标签出错`)
      }
    },
  })

  const form = useForm<UpdateTagNameDTO>({
    resolver: zodResolver(UpdateTagNameSchema),
    mode: 'onBlur',
  })

  useEffect(() => {
    if (isModalOpen && tagName && id) {
      form.reset({
        id,
        tagName,
      })
    }
  }, [isModalOpen, form, tagName, id])

  async function onSubmit(values: UpdateTagNameDTO) {
    mutate(values)
    onModalClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="paper-card-strong gap-0 rounded-[28px] border-white/80 bg-[#f8f5f0]/95 p-6 shadow-[0_28px_90px_-48px_rgba(41,66,69,0.52)] dark:border-white/12 dark:bg-[#10191b]/95 sm:max-w-[480px]">
        <DialogHeader className="space-y-3 text-left">
          <span className="paper-label w-fit">tag editor</span>
          <DialogTitle className="paper-title text-3xl">编辑标签</DialogTitle>
          <DialogDescription className="text-sm leading-7 text-foreground/60">
            修改标签名会同步影响所有关联内容的展示。
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="tagName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground/66">标签名</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="请输入新的标签名"
                        {...field}
                        className="h-11 rounded-[18px] border-white/80 bg-white/82 dark:border-white/12 dark:bg-white/[0.06]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-2">
                <Button
                  type="submit"
                  className="cursor-pointer rounded-full px-6"
                  disabled={isPending}
                >
                  {isPending ? '保存中...' : '保存修改'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
