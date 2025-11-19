# Blog 模块迁移设计

## 概述

Blog 模块迁移涉及后端 Go-Zero API 实现和前端 Next.js 改造。后端需要实现 7 个 RESTful 端点，前端需要将 Server Actions 替换为 Go API 调用。

## 架构

### 后端架构

```
HTTP Request
    ↓
Handler (验证请求格式)
    ↓
Logic (业务逻辑)
    ↓
Database (PostgreSQL)
    ↓
Revalidate Webhook (触发 Next.js 再验证)
```

### 前端架构

```
React Component
    ↓
API Client (lib/api/blog.ts)
    ↓
Go API
    ↓
React Query (缓存管理)
```

## 组件和接口

### 后端组件

#### 1. Handler 层（HTTP 请求处理）
- `BlogListHandler` - GET /api/blogs
- `BlogDetailHandler` - GET /api/blogs/:slug
- `BlogDetailHtmlHandler` - GET /api/blogs/:slug/html
- `BlogCreateHandler` - POST /api/blogs
- `BlogUpdateHandler` - PUT /api/blogs/:id
- `BlogToggleHandler` - PATCH /api/blogs/:id/publish
- `BlogDeleteHandler` - DELETE /api/blogs/:id

#### 2. Logic 层（业务逻辑）
- `BlogListLogic` - 列表查询、搜索、筛选、分页
- `BlogDetailLogic` - 获取单个博客（markdown）
- `BlogDetailHtmlLogic` - 获取单个博客（HTML 渲染）
- `BlogCreateLogic` - 创建博客、关联标签
- `BlogUpdateLogic` - 更新博客、同步标签
- `BlogToggleLogic` - 切换发布状态
- `BlogDeleteLogic` - 删除博客及标签关联

#### 3. 数据模型
```go
type Blog struct {
    Id          int64
    Slug        string
    Title       string
    Content     string      // markdown
    IsPublished bool
    CreatedAt   time.Time
    UpdatedAt   time.Time
    Tags        []BlogTag   // 关联标签
}

type BlogTag struct {
    Id      int64
    TagName string
    TagType string // "BLOG"
}
```

#### 4. 数据库查询
- 列表查询：支持 title/content 搜索、标签筛选、发布状态筛选、分页
- 详情查询：按 slug 查询
- 标签关联：通过 BlogBlogTag 联结表查询

### 前端组件

#### 1. API 客户端（lib/api/blog.ts）
```typescript
fetchBlogs(params)           // 列表/搜索
fetchBlogBySlug(slug)        // 详情（markdown）
fetchBlogHtmlBySlug(slug)    // 详情（HTML）
createBlog(body)             // 创建
updateBlog(id, body)         // 更新
toggleBlogPublished(id, status) // 切换发布
deleteBlog(id)               // 删除
```

#### 2. 页面组件
- `modules/admin/page/admin-blog-page` - 列表页面
- `app/admin/blog/edit/[[...slug]]/page.tsx` - 编辑页面
- `app/(main)/blog/[slug]/page.tsx` - 详情页面

## 数据模型

### Blog 表
```sql
CREATE TABLE "Blog" (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    isPublished BOOLEAN DEFAULT false,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);
```

### BlogTag 表
```sql
CREATE TABLE "BlogTag" (
    id BIGSERIAL PRIMARY KEY,
    tagName VARCHAR(255) NOT NULL,
    tagType VARCHAR(50) DEFAULT 'BLOG'
);
```

### BlogBlogTag 联结表
```sql
CREATE TABLE "BlogBlogTag" (
    blogId BIGINT REFERENCES "Blog"(id) ON DELETE CASCADE,
    blogTagId BIGINT REFERENCES "BlogTag"(id) ON DELETE CASCADE,
    PRIMARY KEY (blogId, blogTagId)
);
```

## 错误处理

- 404: Blog 不存在
- 409: Slug 已存在（创建时）
- 400: 请求参数无效
- 401: 未授权
- 403: 无管理员权限

## 测试策略

### 后端测试
- 单元测试：Logic 层的业务逻辑
- 集成测试：Handler + Logic + Database
- 端到端测试：完整的 API 流程

### 前端测试
- 组件测试：页面组件的渲染和交互
- 集成测试：API 调用和数据更新

## 再验证（ISR）

创建、更新、删除、发布切换成功后，调用 Next.js webhook：
```
POST /api/revalidate
x-revalidate-secret: <secret>
{ "paths": ["/blog", "/admin/blog"] }
```

## 实现顺序

1. **后端 Handler 和 Logic** - 实现所有 7 个 API 端点
2. **前端 API 客户端** - 创建 lib/api/blog.ts
3. **前端列表页面** - 迁移 admin-blog-page
4. **前端编辑页面** - 迁移 admin-article-edit-page
5. **前端详情页面** - 迁移 blog/[slug]/page.tsx

