import Link from 'next/link'

const ExternalLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/NeilYeTAT',
  },
  {
    name: 'bilibili',
    url: 'https://space.bilibili.com/1859558916',
  },
  {
    name: '掘金',
    url: 'https://juejin.cn/user/64204896208252',
  },
  {
    name: 'Gmail',
    url: 'mailto:nearjilt@gmail.com',
  },
] as const

export default function ContactMe() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 text-center">
      <span className="paper-label">contact</span>
      <div className="space-y-2">
        <h3 className="paper-title text-2xl md:text-3xl">在别处继续找到我</h3>
        <p className="text-sm text-foreground/62 md:text-base">
          如果你想聊技术、设计，或者只是打个招呼。
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {ExternalLinks.map(link => (
          <Link
            className="rounded-full border border-white/85 bg-white/82 px-4 py-2 text-sm font-medium text-primary transition-transform hover:-translate-y-0.5 dark:border-white/12 dark:bg-white/[0.06] dark:text-white/85"
            href={link.url}
            key={link.url}
            target="_blank"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
