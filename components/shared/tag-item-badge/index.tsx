export default function TagItemBadge({ tag }: { tag: string }) {
  return (
    <span
      className="border-b border-dashed border-b-foreground"
    >
      {`#${tag}`}
    </span>
  )
}
