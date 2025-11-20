'use client'

import { createTag } from '@/lib/api/tag'
import { TagType } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新建标签</DialogTitle>
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
                      <Input placeholder="请输入标签名" {...field} />
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
                    <FormLabel>标签类型</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="请选择" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={TagType.BLOG}>BLOG</SelectItem>
                          <SelectItem value={TagType.NOTE}>NOTE</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" className="cursor-pointer">保存</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
