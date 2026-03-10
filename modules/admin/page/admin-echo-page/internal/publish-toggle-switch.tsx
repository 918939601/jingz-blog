'use client'

import { toggleEchoPublished } from '@/lib/api/echo'
import { Switch } from '@/components/ui/switch'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'

export default function PublishToggleSwitch({ echoId, isPublished: initial }: { echoId: number, isPublished: boolean }) {
  const [isPublished, setIsPublished] = useState(initial)
  const [isPending, startTransition] = useTransition()
  const queryClient = useQueryClient()

  // 当 initial prop 变化时，更新内部状态
  useEffect(() => {
    setIsPublished(initial)
  }, [initial])

  const handleToggle = async () => {
    const newStatus = !isPublished
    setIsPublished(newStatus)

    startTransition(async () => {
      try {
        await toggleEchoPublished(echoId, newStatus)
        queryClient.invalidateQueries({
          queryKey: ['echo-list'],
          exact: false,
        })
        toast.success(`更新成功`)
      }
      catch (error) {
        setIsPublished(!newStatus)
        if (error instanceof Error) {
          toast.error(`发布状态更新失败 ${error?.message}`)
        }
        else {
          toast.error(`发布状态更新失败`)
        }
      }
    })
  }

  return (
    <Switch
      onCheckedChange={handleToggle}
      checked={isPublished}
      disabled={isPending}
    />
  )
}
