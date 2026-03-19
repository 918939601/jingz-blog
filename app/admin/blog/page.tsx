import { fetchBlogs } from '@/lib/api/blog'
import { fetchTags } from '@/lib/api/tag'
import AdminBlogPage from '@/modules/admin/page/admin-blog-page'

export default async function Page() {
  const [initialBlogResponse, initialBlogTags] = await Promise.all([
    fetchBlogs({
      page: 1,
      pageSize: 50,
    }),
    fetchTags('BLOG'),
  ])

  return (
    <AdminBlogPage
      initialBlogResponse={initialBlogResponse}
      initialBlogTags={initialBlogTags}
    />
  )
}
