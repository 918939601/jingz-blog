# Blog 模块迁移 - 实现任务

## 后端实现

- [x] 1. 创建 Blog Handler 和 Logic 框架
  - 在 `server/blogapi/internal/handler/blog/` 创建所有 handler 文件
  - 在 `server/blogapi/internal/logic/blog/` 创建所有 logic 文件
  - 在 `server/blogapi/internal/types/blog.go` 定义请求/响应类型
  - _Requirements: 需求 1-7_

- [x] 2. 实现 Blog 列表/搜索 API
  - 实现 `BlogListLogic` - 支持 query、tags、published 筛选
  - 实现 `BlogListHandler` - GET /api/blogs
  - 支持分页（page、pageSize）
  - _Requirements: 需求 1_

- [x] 3. 实现 Blog 详情 API（Markdown）
  - 实现 `BlogDetailLogic` - 按 slug 查询
  - 实现 `BlogDetailHandler` - GET /api/blogs/:slug
  - 返回完整的 Blog 对象（content 为 markdown）
  - _Requirements: 需求 2_

- [ ] 4. 实现 Blog 详情 API（HTML 渲染）
  - 实现 `BlogDetailHtmlLogic` - markdown 转 HTML
  - 实现 `BlogDetailHtmlHandler` - GET /api/blogs/:slug/html
  - 集成 markdown 渲染库（shiki、remark-gfm 等）
  - _Requirements: 需求 3_

- [x] 5. 实现 Blog 创建 API
  - 实现 `BlogCreateLogic` - 创建 Blog、关联标签
  - 实现 `BlogCreateHandler` - POST /api/blogs（需管理员权限）
  - 处理 slug 冲突检查
  - 调用 revalidate webhook
  - _Requirements: 需求 4_

- [x] 6. 实现 Blog 更新 API
  - 实现 `BlogUpdateLogic` - 更新 Blog、同步标签
  - 实现 `BlogUpdateHandler` - PUT /api/blogs/:id（需管理员权限）
  - 处理标签关联的增删
  - 调用 revalidate webhook
  - _Requirements: 需求 5_

- [x] 7. 实现 Blog 发布切换 API
  - 实现 `BlogToggleLogic` - 切换发布状态
  - 实现 `BlogToggleHandler` - PATCH /api/blogs/:id/publish（需管理员权限）
  - 调用 revalidate webhook
  - _Requirements: 需求 6_

- [x] 8. 实现 Blog 删除 API
  - 实现 `BlogDeleteLogic` - 删除 Blog 及标签关联
  - 实现 `BlogDeleteHandler` - DELETE /api/blogs/:id（需管理员权限）
  - 调用 revalidate webhook
  - _Requirements: 需求 7_

- [x] 9. 注册 Blog 路由
  - 在 `server/blogapi/internal/handler/routes.go` 注册所有 Blog 路由
  - 确保路由前缀为 `/api`
  - _Requirements: 需求 1-7_

## 前端实现

- [x] 10. 创建 Blog API 客户端
  - 创建 `lib/api/blog.ts`
  - 实现 `fetchBlogs()`、`fetchBlogBySlug()`、`fetchBlogHtmlBySlug()`
  - 实现 `createBlog()`、`updateBlog()`、`toggleBlogPublished()`、`deleteBlog()`
  - 使用 `apiFetch` 自动附加 Bearer token
  - _Requirements: 需求 8-10_

- [ ] 11. 修复前端数据类型不匹配问题
  - 修复 `modules/admin/page/admin-blog-page/index.tsx` 中 BlogDTO 类型与 BlogListItem 类型的不匹配
  - 修复 `app/(main)/blog/[slug]/page.tsx` 中 createdAt 类型问题（string vs Date）
  - 更新 BlogListTable 组件接收 BlogDTO[] 而非 BlogListItem[]
  - _Requirements: 需求 8, 10_

- [ ] 12. 迁移博客列表页面
  - 修改 `modules/admin/page/admin-blog-page/index.tsx`
  - 替换 `getBlogList`、`getBlogsBySelectedTagName`、`getQueryBlog` 为 Go API
  - 使用 React Query 管理数据缓存
  - 保持现有的搜索、筛选、分页功能
  - _Requirements: 需求 8_

- [x] 13. 迁移博客编辑页面
  - 修改 `components/shared/admin-article-edit-page/index.tsx`
  - 替换 `createBlog`、`updateBlogById` 为 Go API
  - 修改 `app/admin/blog/edit/[[...slug]]/page.tsx`
  - 替换 `getRawBlogBySlug` 为 Go API
  - 保持现有的表单验证和错误处理
  - _Requirements: 需求 9_

- [x] 14. 迁移博客详情页面
  - 修改 `app/(main)/blog/[slug]/page.tsx`
  - 替换 `getPublishedBlogHTMLBySlug` 为 Go API
  - 保持现有的样式和评论功能
  - _Requirements: 需求 10_

- [ ]* 15. 测试 Blog 功能
  - 测试列表页面的搜索、筛选、分页
  - 测试编辑页面的创建、更新、删除
  - 测试详情页面的渲染
  - 验证发布状态切换
  - _Requirements: 需求 1-10_

