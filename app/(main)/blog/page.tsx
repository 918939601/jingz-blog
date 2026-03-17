import BlogListPage from '@/modules/main/page/blog-list-page'
import { getCachedBlogListData } from '@/lib/article-page-data'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const blogs = await getCachedBlogListData()
  return <BlogListPage initialBlogs={blogs} />
}
