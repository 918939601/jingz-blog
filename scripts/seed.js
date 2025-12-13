/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv/config')

const { PrismaClient, TagType } = require('@prisma/client')

const prisma = new PrismaClient()

const blogTags = [
  'go',
  'react',
  'kafka',
  'postgres',
  'observability',
  'architecture',
  'performance',
]

const noteTags = [
  'snippet',
  'go',
  'react',
  'kafka',
  'ops',
  'reading',
]

const blogs = [
  {
    slug: 'go-service-observability',
    title: 'Go 服务观测实战：pprof + OpenTelemetry',
    tags: ['go', 'observability', 'performance'],
    content: `这篇笔记记录了我们在 Go 服务中接入 pprof 与 OpenTelemetry 的实践，重点是采样开销与指标面板设计。

核心步骤：
1. 在 HTTP 服务挂载 /debug/pprof，结合火焰图快速定位热点。
2. 使用 OTLP 导出 trace/span，并在 Jaeger 上串联请求链路。
3. 将 Go runtime 指标暴露到 Prometheus，针对 GC pause、goroutine 数做阈值告警。

实践 tip：生产环境建议定时采样而不是全量采集，避免影响 P99 延迟。`,
  },
  {
    slug: 'react-forms-best-practices',
    title: 'React 表单最佳实践：hooks、受控与性能',
    tags: ['react'],
    content: `总结最近在 React 表单开发中的经验，主要围绕三个问题：

- 受控组件与非受控的取舍：简单表单用受控保持一致性，复杂大表单用 ref + watch 减少重渲染。
- 状态管理：用 react-hook-form 管理注册/验证，结合 zod 做 schema 校验。
- 性能：拆分字段组件，配合 React.memo + useCallback，避免级联重渲染。

示例代码片段：
\`\`\`tsx
const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema) })
return <input {...register('email')} className="input" />
\`\`\`
`,
  },
  {
    slug: 'kafka-exactly-once-guide',
    title: 'Kafka 实战：从 at-least-once 到 exactly-once',
    tags: ['kafka', 'architecture'],
    content: `本文用一个订单流水的案例解释 Kafka 消费语义：

1. at-least-once：开启手动提交 offset，失败重试会导致重复消费，需要幂等落库。
2. at-most-once：自动提交 offset，失败不重放，可能数据丢失。
3. exactly-once：使用事务性 producer + 幂等 consumer 端落表，配合外部存储的幂等键。

遇到的坑：事务性生产者要求 broker 配置 \`transaction.state.log.replication.factor\`，否则会报初始化失败。`,
  },
  {
    slug: 'postgres-index-tuning',
    title: 'Postgres 索引调优：Explain 与常见误区',
    tags: ['postgres', 'performance'],
    content: `记录一次调优经验：查询使用组合条件 (user_id, created_at)，但仅建了单列索引。

优化步骤：
- 用 \`EXPLAIN (ANALYZE, BUFFERS)\` 查看是否走 Seq Scan。
- 添加复合索引 \`(user_id, created_at DESC)\` 后，查询延迟从 800ms 降到 40ms。
- 注意避免在 where 上对索引列使用函数，导致索引失效。

复盘：写查询前先想好过滤条件的选择性，预先规划组合索引。`,
  },
]

const notes = [
  {
    slug: 'go-context-cancellation',
    title: 'Go context 取消最佳实践',
    tags: ['go', 'snippet'],
    content: `一句话：只在入口创建 context，向下传递，确保 defer cancel。

- HTTP handler 收到请求创建 ctx，超时 2-3s 合理。
- goroutine 里要监听 ctx.Done，避免泄漏。
- 调第三方接口时可用 context.WithTimeout 包装。`,
  },
  {
    slug: 'react-query-stale-time',
    title: 'React Query 的 staleTime 设置',
    tags: ['react', 'snippet'],
    content: `staleTime 用来降低重复请求：

- 列表页可设 30s，切换 tab 不会立即 refetch。
- 详情页可更短，确保数据新鲜。
- 后台更新频繁的页面仍需启用 refetchOnWindowFocus。`,
  },
  {
    slug: 'kafka-partitioning',
    title: 'Kafka 分区选择小记',
    tags: ['kafka', 'ops'],
    content: `分区数量决定吞吐与有序性：

- 需要按用户有序消费时，用 user_id 作为 key 保证落同一分区。
- 提前规划分区数，避免后期扩分区打乱顺序。
- 高吞吐场景优先考虑批量生产和压缩（lz4/zstd）。`,
  },
]

const echoes = [
  { reference: 'home', content: '写点真实的笔记，比什么都强。' },
  { reference: 'footer', content: 'Keep shipping, keep learning.' },
  { reference: 'hero', content: '把线上问题记下来，下一次就少踩一个坑。' },
]

async function seedTags() {
  await Promise.all(
    blogTags.map(tagName =>
      prisma.blogTag.upsert({
        where: { tagName },
        update: {},
        create: { tagName, tagType: TagType.BLOG },
      }),
    ),
  )

  await Promise.all(
    noteTags.map(tagName =>
      prisma.noteTag.upsert({
        where: { tagName },
        update: {},
        create: { tagName, tagType: TagType.NOTE },
      }),
    ),
  )
}

async function seedBlogs() {
  for (const blog of blogs) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: {
        title: blog.title,
        content: blog.content,
        isPublished: blog.isPublished ?? true,
        tags: {
          set: blog.tags.map(tagName => ({ tagName })),
        },
      },
      create: {
        slug: blog.slug,
        title: blog.title,
        content: blog.content,
        isPublished: blog.isPublished ?? true,
        tags: {
          connect: blog.tags.map(tagName => ({ tagName })),
        },
      },
    })
  }
}

async function seedNotes() {
  for (const note of notes) {
    await prisma.note.upsert({
      where: { slug: note.slug },
      update: {
        title: note.title,
        content: note.content,
        isPublished: note.isPublished ?? true,
        tags: {
          set: note.tags.map(tagName => ({ tagName })),
        },
      },
      create: {
        slug: note.slug,
        title: note.title,
        content: note.content,
        isPublished: note.isPublished ?? true,
        tags: {
          connect: note.tags.map(tagName => ({ tagName })),
        },
      },
    })
  }
}

async function seedEchoes() {
  await prisma.echo.deleteMany()
  if (echoes.length > 0) {
    await prisma.echo.createMany({ data: echoes })
  }
}

async function main() {
  console.log('Seeding tags...')
  await seedTags()
  console.log('Seeding blogs...')
  await seedBlogs()
  console.log('Seeding notes...')
  await seedNotes()
  console.log('Refreshing echoes...')
  await seedEchoes()
}

main()
  .then(() => {
    console.log('Seeding completed')
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
