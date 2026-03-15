import { Skeleton } from '@/components/ui/skeleton'
import { toggleVariants } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'

export default function TagContainerSkeleton() {
  return (
    <>
      {Array.from({ length: 15 }).map((_, i) => (
        <Skeleton
          className={cn(
            toggleVariants({ variant: 'outline', size: 'sm' }),
            'mr-3 w-24 px-0',
          )}
          key={`${i.toString()}`}
        />
      ))}
    </>
  )
}
