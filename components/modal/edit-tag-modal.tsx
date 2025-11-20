'use client'

import { updateTag } from '@/lib/api/tag'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useModalStore } from '@/store/use-modal-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const UpdateTagNameSchema = z.object({
  id: z.number(),
  tagName: z.string().min(1, '标签名不能为空'),
})

type UpdateTagNameDTO = z.infer<typeof UpdateTagNameSchema>

export default function EditTagModal() {
  const { modalType, onModalClose, payload } = useModalStore()
  const isModalOpen = modalType === 'editTagModal'
  const { id, tagName } = payload
    ? (payload as { id: number; tagName: string })
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
        id: id,
        tagName: tagName,
      })
    }
  }, [isModalOpen, form, tagName, id])

  async function onSubmit(values: UpdateTagNameDTO) {
    mutate(values)
    onModalClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑标签</DialogTitle>
          <DialogDescription>
            修改标签名会影响所有关联的文章喵~
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="tagName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>标签名</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入新的标签名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="cursor-pointer" disabled={isPending}>保存修改</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
