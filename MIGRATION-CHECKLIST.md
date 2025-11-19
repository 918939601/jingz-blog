# Go后端迁移检查清单

## ✅ 已完全迁移到Go后端的模块

### Echo模块
- [x] 列表API - `fetchEchos()` → Go后端 `/api/echos`
- [x] 发布列表API - `fetchPublishedEchos()` → Go后端 `/api/echos/published`
- [x] 创建API - `createEcho()` → Go后端 `POST /api/echos`
- [x] 更新API - `updateEcho()` → Go后端 `PUT /api/echos/:id`
- [x] 删除API - `deleteEcho()` → Go后端 `DELETE /api/echos/:id`
- [x] 发布状态切换 - `toggleEchoPublished()` → Go后端 `PATCH /api/echos/:id/publish`

### Blog模块
- [x] 列表API - `fetchBlogs()` → Go后端 `/api/blogs`
- [x] 详情API - `fetchBlogBySlug()` → Go后端 `/api/blogs/:slug`
- [x] HTML详情API - `fetchBlogHtmlBySlug()` → Go后端 `/api/blogs/:slug/html`
- [x] 创建API - `createBlog()` → Go后端 `POST /api/blogs`
- [x] 更新API - `updateBlog()` → Go后端 `PUT /api/blogs/:id`
- [x] 删除API - `deleteBlog()` → Go后端 `DELETE /api/blogs/:id`
- [x] 发布状态切换 - `toggleBlogPublished()` → Go后端 `PATCH /api/blogs/:id/publish`
- [x] 编辑页面初始化 - `fetchBlogBySlug()` → Go后端

### Note模块
- [x] 列表API - `fetchNotes()` → Go后端 `/api/notes`
- [x] 详情API - `fetchNoteBySlug()` → Go后端 `/api/notes/:slug`
- [x] HTML详情API - `fetchNoteHtmlBySlug()` → Go后端 `/api/notes/:slug/html`
- [x] 创建API - `createNote()` → Go后端 `POST /api/notes`
- [x] 更新API - `updateNote()` → Go后端 `PUT /api/notes/:id`
- [x] 删除API - `deleteNote()` → Go后端 `DELETE /api/notes/:id`
- [x] 发布状态切换 - `toggleNotePublished()` → Go后端 `PATCH /api/notes/:id/publish`
- [x] 编辑页面初始化 - `fetchNoteBySlug()` → Go后端

### Tag模块
- [x] 列表API - `fetchTags()` → Go后端 `/api/tags`
- [x] 创建API - `createTag()` → Go后端 `POST /api/tags`
- [x] 更新API - `updateTag()` → Go后端 `PUT /api/tags/:id`
- [x] 删除API - `deleteTag()` → Go后端 `DELETE /api/tags/:id`
- [x] Blog编辑页面 - `fetchTags('BLOG')` → Go后端
- [x] Note编辑页面 - `fetchTags('NOTE')` → Go后端

## 📋 前端API文件检查

| 文件 | 状态 | 说明 |
|------|------|------|
| `lib/api/echo.ts` | ✅ | 完全使用Go后端 |
| `lib/api/blog.ts` | ✅ | 完全使用Go后端 |
| `lib/api/note.ts` | ✅ | 完全使用Go后端 |
| `lib/api/tag.ts` | ✅ | 完全使用Go后端 |

## 🔍 前端页面检查

| 页面 | 使用的API | 状态 |
|------|----------|------|
| `/admin/echo` | `fetchEchos()` | ✅ Go后端 |
| `/admin/blog` | `fetchBlogs()` | ✅ Go后端 |
| `/admin/note` | `fetchNotes()` | ✅ Go后端 |
| `/admin/blog/edit/[slug]` | `fetchBlogBySlug()`, `fetchTags()` | ✅ Go后端 |
| `/admin/note/edit/[slug]` | `fetchNoteBySlug()`, `fetchTags()` | ✅ Go后端 |
| `/(main)/blog/[slug]` | `fetchBlogHtmlBySlug()` | ✅ Go后端 |
| `/(main)/note/[slug]` | `fetchNoteHtmlBySlug()` | ✅ Go后端 |

## 🚫 不再使用的Prisma代码

以下文件中的代码已不再被使用，但暂未删除：

- `actions/blogs/index.ts` - 旧的blog server actions
- `actions/notes/index.ts` - 旧的note server actions
- `actions/tags/index.ts` - 旧的tag server actions

## ✨ 总结

**项目已完全迁移到Go后端！**

所有的业务逻辑API调用都已从Prisma server actions迁移到Go后端API。

前端现在通过以下方式与后端通信：
- Echo: `lib/api/echo.ts`
- Blog: `lib/api/blog.ts`
- Note: `lib/api/note.ts`
- Tag: `lib/api/tag.ts`

所有API都通过HTTP调用Go后端服务（`http://localhost:8080`）。
