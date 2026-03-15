'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { TagType } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createTag } from '@/lib/api/tag'
import { useModalStore } from '@/store/use-modal-store'

const CreateTagSchema = z.object({
  tagName: z.string().min(1, '标签名不能为空'),
  tagType: z.nativeEnum(TagType),
})

type CreateTagDTO = z.infer<typeof CreateTagSchema>

export default function CreateTagModal() {
  const { modalType, onModalClose } = useModalStore()
  const isModalOpen = modalType === 'createTagModal'
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (values: CreateTagDTO) => createTag(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success(`创建成功`)
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(`创建标签失败~ ${error.message}`)
      }
      else {
        toast.error(`创建标签失败~`)
      }
    },
  })

  const form = useForm<CreateTagDTO>({
    resolver: zodResolver(CreateTagSchema),
    defaultValues: {
      tagName: '',
      tagType: TagType.BLOG,
    },
    mode: 'onBlur',
  })

  useEffect(() => {
    if (!isModalOpen) {
      form.reset()
    }
  }, [isModalOpen, form])

  function onSubmit(values: CreateTagDTO) {
    mutation.mutate(values)
    onModalClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="paper-card-strong gap-0 rounded-[28px] border-white/80 bg-[#f8f5f0]/95 p-6 shadow-[0_28px_90px_-48px_rgba(41,66,69,0.52)] dark:border-white/12 dark:bg-[#10191b]/95 sm:max-w-[480px]">
        <DialogHeader className="space-y-3 text-left">
          <span className="paper-label w-fit">tag editor</span>
          <DialogTitle className="paper-title text-3xl">新建标签</DialogTitle>
          <p className="text-sm leading-7 text-foreground/60">
            用统一的标签体系整理博客和笔记内容。
          </p>
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
                        placeholder="请输入标签名"
                        {...field}
                        className="h-11 rounded-[18px] border-white/80 bg-white/82 dark:border-white/12 dark:bg-white/[0.06]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tagType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground/66">标签类型</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                        }}
                      >
                        <SelectTrigger className="h-11 w-full rounded-[18px] border-white/80 bg-white/82 dark:border-white/12 dark:bg-white/[0.06]">
                          <SelectValue placeholder="请选择" />
                        </SelectTrigger>
                        <SelectContent className="rounded-[20px] border-white/80 bg-[#f8f5f0]/95 dark:border-white/12 dark:bg-[#10191b]/95">
                          <SelectItem value={TagType.BLOG}>BLOG</SelectItem>
                          <SelectItem value={TagType.NOTE}>NOTE</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-2">
                <Button
                  type="submit"
                  className="cursor-pointer rounded-full px-6"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? '保存中...' : '保存'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
