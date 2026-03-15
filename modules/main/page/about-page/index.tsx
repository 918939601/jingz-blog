import { ArrowDownIcon } from 'lucide-react'
import * as motion from 'motion/react-client'
import Link from 'next/link'
import HorizontalDividingLine from '@/components/shared/horizontal-dividing-line'
import MaxWidthWrapper from '@/components/shared/max-width-wrapper'

const timeline = [
  {
    time: '2025 年 9 月',
    title: '博客的诞生',
    lines: [
      '在b站上偶然刷到了大佬的博客视频，于是乎',
      '直接借鉴（抄袭），所以你可以看出来本博客的样式、内容几乎差不多',
      '感谢大佬开源🙏',
    ],
    link: {
      href: 'https://www.useyeyu.cc',
      label: '叶鱼',
    },
  },
  // {
  //   time: '2023 夏',
  //   title: '从 Java 拐向前端',
  //   lines: [
  //     '地平线4、只狼、去月球、寻找天堂、恋爱绮谭轮着玩。',
  //     '认真学了一段 Java，然后决定转前端。',
  //     'Win11 崩掉之后，顺手换到了 MacBook Air M2。',
  //   ],
  // },
  // {
  //   time: '2024 夏',
  //   title: '开始认真学 React',
  //   lines: [
  //     'React 比我想象得更有意思，越写越上头。',
  //     '补番、打游戏、重看青春猪头少年，也开始想学一点日语。',
  //     '那一年开始真正感觉到，写代码可以是长期要做的事。',
  //   ],
  // },
  // {
  //   time: '2025 初夏',
  //   title: '实习准备期',
  //   lines: [
  //     '一边准备项目和面试，一边看一些 Web3 相关内容。',
  //     '给开源项目修过几个小问题，也收到了第一份来自社区的礼物。',
  //     '第一次感受到，把东西做出来并被别人接住，是很具体的反馈。',
  //   ],
  //   link: {
  //     href: 'https://openbuild.xyz/',
  //     label: 'OpenBuild',
  //   },
  // },
  // {
  //   time: '2025 暑假',
  //   title: '开始实习',
  //   lines: [
  //     '第一次没有把整个暑假都用来深夜打游戏。',
  //     '发现自己对找 bug 和做推理这件事有点天然兴趣。',
  //     '安静环境、清晰问题和一点点侦探感，可能就是我喜欢写代码的原因。',
  //   ],
  // },
]

export default function AboutPage() {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: [30, -8, 0], opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
      }}
    >
      <MaxWidthWrapper className="flex max-w-5xl flex-col gap-6 md:gap-8">
        <section className="paper-card-strong grid gap-6 p-5 md:grid-cols-[minmax(0,1.1fr)_280px] md:p-8">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="paper-label">about</span>
              <span className="paper-label !tracking-[0.18em]">personal archive</span>
            </div>
            <h1 className="paper-title mt-5 text-4xl leading-tight md:text-5xl">
              你可以叫我
              {' '}
              <span className="text-[#4ca79a] dark:text-[#8ed2c8]">Jin</span>
            </h1>
            <div className="mt-4 space-y-3 text-sm leading-7 text-foreground/68 md:text-base">
              <p>不要让梦想埋没啊啊啊啊啊啊啊啊啊啊啊</p>
              <p>喜欢周杰伦的歌曲</p>
              <p>我想找到工作啊啊啊啊啊啊啊啊啊啊啊</p>
            </div>
          </div>

          <div className="paper-card flex flex-col justify-between p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-foreground/42">Aliases</p>
              <p className="mt-3 text-lg leading-8 text-foreground"> A Newbie</p>
            </div>
            <div className="mt-6 space-y-2 text-sm text-foreground/58">
              <p>喜欢图书馆</p>
              <p>喜欢刷抖音</p>
              <p>喜欢看些前后端的技术</p>
              <p>但是看后不敲，导致看了忘，等于白学</p>
            </div>
          </div>
        </section>

        <section className="paper-card px-5 py-6 md:px-8 md:py-7">
          <HorizontalDividingLine fill="#57b8ab" />
          <div className="mt-6 text-center">
            <h2 className="paper-title text-3xl md:text-4xl">"     "</h2>
            <p className="mt-3 text-sm text-foreground/62 md:text-base">
              ""
            </p>
          </div>
        </section>

        <section className="grid gap-4">
          {timeline.map((item, index) => (
            <article
              key={item.time}
              className="paper-card grid gap-5 p-5 md:grid-cols-[140px_minmax(0,1fr)] md:p-7"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-foreground/42">
                  {item.time}
                </p>
                <p className="mt-3 text-sm text-foreground/46">
                  {`Chapter ${index + 1}`}
                </p>
              </div>

              <div>
                <h3 className="paper-title text-2xl md:text-3xl">{item.title}</h3>
                <div className="mt-4 space-y-3 text-sm leading-7 text-foreground/68 md:text-base">
                  {item.lines.map(line => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                {item.link && (
                  <div className="mt-5">
                    <ArrowDownIcon className="mb-3 text-[#57b8ab] md:size-8 animate-bounce" />
                    <Link
                      href={item.link.href}
                      target="_blank"
                      className="inline-flex rounded-full border border-white/85 bg-white/82 px-4 py-2 text-sm font-medium text-primary transition-transform hover:-translate-y-0.5 dark:border-white/12 dark:bg-white/[0.06] dark:text-primary"
                    >
                      {item.link.label}
                    </Link>
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>
      </MaxWidthWrapper>
    </motion.div>
  )
}
