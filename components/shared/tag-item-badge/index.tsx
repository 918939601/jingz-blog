export default function TagItemBadge({ tag }: { tag: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full border border-white/85 bg-white/82 px-3 py-1 text-xs font-medium text-primary dark:border-white/12 dark:bg-white/[0.06] dark:text-primary"
    >
      {`#${tag}`}
    </span>
  )
}
