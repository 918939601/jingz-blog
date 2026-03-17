import BlogListPage from '@/modules/main/page/blog-list-page'
import { getCachedBlogListData } from '@/lib/article-page-data'

export const revalidate = 300

export default async function Page() {
  const blogs = await getCachedBlogListData()
  return <BlogListPage initialBlogs={blogs} />
}
