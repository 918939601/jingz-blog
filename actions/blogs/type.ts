import type { getBlogList } from '@/actions/blogs'

export type BlogListItem = Awaited<ReturnType<typeof getBlogList>>[number]
