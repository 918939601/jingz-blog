import { cn } from '@/lib/utils'

// * 后序给配置颜色
export default function ScaleUnderline({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        `absolute left-0 bottom-1 h-0.5 bg-pink-600 w-full
                      scale-x-0 group-hover:scale-x-100
                      origin-right group-hover:origin-left
                      transition-transform duration-[350ms] ease-[cubic-bezier(.77,0,.18,1)]`,
        className,
      )}
    />
  )
}
