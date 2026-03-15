'use client'

import type { CreateEchoDTO } from '@/lib/schemas/echo'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { createEcho } from '@/lib/api/echo'
import { CreateEchoSchema } from '@/lib/schemas/echo'
import { useModalStore } from '@/store/use-modal-store'

export default function CreateEchoModal() {
  const { modalType, onModalClose } = useModalStore()
  const isModalOpen = modalType === 'createEchoModal'
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (values: CreateEchoDTO) => {
      return createEcho(values)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['echo-list'] })
      toast.success(`创建成功`)
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(`创建引用失败~ ${error.message}`)
      }
      else {
        toast.error(`创建引用失败~`)
      }
    },
  })

  const form = useForm<CreateEchoDTO>({
    resolver: zodResolver(CreateEchoSchema),
    defaultValues: {
      content: '',
      reference: '',
      isPublished: true,
    },
    mode: 'onBlur',
  })

  useEffect(() => {
    if (!isModalOpen) {
      form.reset()
    }
  }, [isModalOpen, form])

  function onSubmit(values: CreateEchoDTO) {
    mutation.mutate(values)
    onModalClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="paper-card-strong gap-0 rounded-[28px] border-white/80 bg-[#f8f5f0]/95 p-6 shadow-[0_28px_90px_-48px_rgba(41,66,69,0.52)] dark:border-white/12 dark:bg-[#10191b]/95 sm:max-w-[560px]">
        <DialogHeader className="space-y-3 text-left">
          <span className="paper-label w-fit">echo editor</span>
          <DialogTitle className="paper-title text-3xl">创建引用</DialogTitle>
          <DialogDescription className="text-sm leading-7 text-foreground/60">
            记录一句值得留下的话，并决定是否立即公开展示。
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground/66">引用内容</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="请输入新的引用"
                        {...field}
                        className="h-52 resize-none rounded-[20px] border-white/80 bg-white/82 px-4 py-3 dark:border-white/12 dark:bg-white/[0.06]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground/66">来源</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="请输入来源"
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
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="paper-card flex flex-row items-center justify-between rounded-[22px] px-4 py-4">
                    <div>
                      <FormLabel className="text-sm font-medium text-foreground">是否发布</FormLabel>
                      <p className="mt-1 text-xs text-foreground/48">开启后会在前台引用区域直接展示。</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                  {mutation.isPending ? '保存中...' : '保存引用'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
