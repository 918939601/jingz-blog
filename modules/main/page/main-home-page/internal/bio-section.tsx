import Link from 'next/link'

const quickLinks = [
  { href: '/blog', label: '看博客' },
  { href: '/note', label: '翻笔记' },
  { href: '/about', label: '关于我' },
]

const focusList = [
  '要写大论文了，呜呜呜呜，不想写😭',
  '有点想做AI相关的东西，又不知道做些啥，哎',
  '还是继续Go吧··········',
  '此外，学点前端是不是也挺好的呢，但是有点懒',
]

const statusItems = [
  { value: 'Backend', label: '主要栖息地' },
  { value: 'RAG、Skill', label: '最近也在看' },
  { value: '想写啥写啥', label: '写作习惯' },
]

export default function BioSection() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <span className="paper-label">independent archive</span>
        <span className="paper-label !tracking-[0.18em]">cn / personal log</span>
      </div>

      <div className="space-y-4">
        <h1 className="paper-title text-4xl leading-[1.04] md:text-6xl">
          你好，我是
          {' '}
          <span className="text-[#4ca79a] dark:text-[#8ed2c8]">Jin</span>
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-foreground/72 md:text-base">
          这里不是只放文章的容器，而是我把博客、笔记和生活碎片整理成长期档案的地方。
          我会在这里持续记录Go、力扣、一些乱七八糟的东西，以及偶尔出现的审美洁癖。
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {statusItems.map(item => (
          <div
            key={item.label}
            className="rounded-[22px] border border-black/6 bg-black/[0.03] px-4 py-4 dark:border-white/10 dark:bg-white/[0.03]"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-foreground/42">{item.label}</p>
            <p className="mt-2 text-lg font-semibold text-foreground md:text-xl">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {quickLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-white/85 bg-white/85 px-5 py-3 text-sm font-medium text-primary transition-transform hover:-translate-y-0.5 dark:border-white/12 dark:bg-white/[0.06] dark:text-white/85"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="rounded-[24px] border border-black/6 bg-black/[0.03] px-4 py-4 dark:border-white/10 dark:bg-white/[0.03]">
        <p className="text-xs uppercase tracking-[0.24em] text-foreground/42">Now</p>
        <div className="mt-3 grid gap-2 text-sm leading-7 text-foreground/68 md:grid-cols-2">
          {focusList.map(item => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </div>

      <small className="text-xs text-foreground/48 md:text-sm">
        头像支持拖拽，双击可以切换明暗主题。
      </small>
    </section>
  )
}
