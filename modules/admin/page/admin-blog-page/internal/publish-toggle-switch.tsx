import { toggleBlogPublished } from '@/lib/api/blog'
import { Switch } from '@/components/ui/switch'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

export default function PublishToggleSwitch({
  blogId,
  isPublished: initial,
}: {
  blogId: number
  isPublished: boolean
}) {
  const [isPublished, setIsPublished] = useState(initial)
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (newStatus: boolean) => toggleBlogPublished(blogId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['blog-list'],
        exact: false,
      })
      toast.success(`更新成功`)
    },
    onError: (error) => {
      setIsPublished(!isPublished)
      if (error instanceof Error) {
        toast.error(`发布状态更新失败 ${error?.message}`)
      }
      else {
        toast.error(`发布状态更新失败`)
      }
    },
  })

  const handleToggle = async () => {
    const newStatus = !isPublished
    setIsPublished(newStatus)
    mutate(newStatus)
  }

  return (
    <Switch
      onCheckedChange={handleToggle}
      checked={isPublished}
      disabled={isPending}
    />
  )
}
