'use client'

import type { UpdateEchoDTO } from '@/lib/schemas/echo'
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
import { updateEcho } from '@/lib/api/echo'
import { UpdateEchoSchema } from '@/lib/schemas/echo'
import { useModalStore } from '@/store/use-modal-store'

export default function EditEchoModal() {
  const { modalType, onModalClose, payload } = useModalStore()
  const isModalOpen = modalType === 'editEchoModal'

  const { id, content, isPublished, reference } = payload
    ? (payload as UpdateEchoDTO)
    : {}

  const initialValues: UpdateEchoDTO = {
    content: content ?? '',
    reference: reference ?? '',
    isPublished: isPublished ?? true,
    id: id!,
  }

  const form = useForm<UpdateEchoDTO>({
    resolver: zodResolver(UpdateEchoSchema),
    defaultValues: {
      content: '',
      reference: '',
      isPublished: true,
      id: id!,
    },
    mode: 'onBlur',
  })

  useEffect(() => {
    if (isModalOpen) {
      form.reset(initialValues)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, form])

  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: UpdateEchoDTO) => {
      const { id, reference, content, isPublished } = values
      return updateEcho(id, { reference, content, isPublished })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['echo-list'], exact: false })
      await queryClient.refetchQueries({ queryKey: ['echo-list'], exact: false })
      toast.success(`修改成功`)
      onModalClose()
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(`更新引用失败~ ${error.message}`)
      }
      else {
        toast.error('更新引用失败~')
      }
    },
  })

  function onSubmit(values: UpdateEchoDTO) {
    mutate(values)
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => {
        form.reset(initialValues)
        onModalClose()
      }}
    >
      <DialogContent className="paper-card-strong gap-0 rounded-[28px] border-white/80 bg-[#f8f5f0]/95 p-6 shadow-[0_28px_90px_-48px_rgba(41,66,69,0.52)] dark:border-white/12 dark:bg-[#10191b]/95 sm:max-w-[560px]">
        <DialogHeader className="space-y-3 text-left">
          <span className="paper-label w-fit">echo editor</span>
          <DialogTitle className="paper-title text-3xl">编辑引用</DialogTitle>
          <DialogDescription className="text-sm leading-7 text-foreground/60">
            调整引用文本、来源和公开状态。
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
                        className="h-52 resize-none rounded-[20px] border-white/80 bg-white/82 px-4 py-3 dark:border-white/12 dark:bg-white/[0.06]"
                        value={field.value}
                        onChange={field.onChange}
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
                      <p className="mt-1 text-xs text-foreground/48">关闭后仅在后台保留，不在前台展示。</p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked)
                        }}
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
