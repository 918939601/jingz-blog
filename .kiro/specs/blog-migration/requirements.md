# Blog 模块迁移规划

## 介绍

Blog 模块需要从 Next.js Server Actions + Prisma 完全迁移到 Go-Zero 后端。本规划涵盖后端 API 实现和前端改造。

## 术语表

- **Blog**: 博客文章模块，包含 markdown 内容、发布状态、标签关联
- **BlogTag**: 博客标签，与 Blog 多对多关系
- **Markdown 渲染**: 将 markdown 内容转换为 HTML
- **Server Actions**: Next.js 的服务端函数（需被 Go API 替代）

## 需求

### 需求 1: 实现 Blog 列表/搜索 API

**用户故事**: 作为前端开发者，我想获取博客列表并支持搜索、标签筛选、发布状态筛选

#### 验收标准

1. WHEN 调用 GET /api/blogs，THEN 返回分页的 Blog 列表（默认 20 条）
2. WHEN 传递 query 参数，THEN 按标题或内容搜索
3. WHEN 传递 tags 参数（逗号分隔），THEN 按标签筛选
4. WHEN 传递 published 参数，THEN 按发布状态筛选
5. WHEN 传递 page 和 pageSize 参数，THEN 返回对应分页数据

### 需求 2: 实现 Blog 详情 API（Raw Markdown）

**用户故事**: 作为前端开发者，我想获取原始 markdown 格式的博客内容用于编辑

#### 验收标准

1. WHEN 调用 GET /api/blogs/:slug，THEN 返回完整的 Blog 对象（content 为 markdown）
2. WHEN slug 不存在，THEN 返回 404 错误

### 需求 3: 实现 Blog 详情 API（HTML 渲染）

**用户故事**: 作为前端开发者，我想获取渲染后的 HTML 内容用于展示

#### 验收标准

1. WHEN 调用 GET /api/blogs/:slug/html，THEN 返回 Blog 对象（content 为 HTML）
2. WHEN markdown 包含代码块，THEN 应用代码高亮
3. WHEN markdown 包含 GFM 语法，THEN 正确渲染

### 需求 4: 实现 Blog 创建 API

**用户故事**: 作为管理员，我想创建新的博客文章

#### 验收标准

1. WHEN 调用 POST /api/blogs（需管理员权限），THEN 创建新 Blog 并返回完整数据
2. WHEN 请求包含 relatedTagNames，THEN 自动创建或关联标签
3. WHEN slug 已存在，THEN 返回冲突错误
4. WHEN 创建成功，THEN 触发再验证 webhook

### 需求 5: 实现 Blog 更新 API

**用户故事**: 作为管理员，我想更新博客文章内容

#### 验收标准

1. WHEN 调用 PUT /api/blogs/:id（需管理员权限），THEN 更新 Blog 并返回更新后的数据
2. WHEN 更新 relatedTagNames，THEN 同步标签关联
3. WHEN 更新成功，THEN 触发再验证 webhook

### 需求 6: 实现 Blog 发布切换 API

**用户故事**: 作为管理员，我想切换博客的发布状态

#### 验收标准

1. WHEN 调用 PATCH /api/blogs/:id/publish（需管理员权限），THEN 切换发布状态并返回更新后的数据
2. WHEN 发布状态改变，THEN 触发再验证 webhook

### 需求 7: 实现 Blog 删除 API

**用户故事**: 作为管理员，我想删除博客文章

#### 验收标准

1. WHEN 调用 DELETE /api/blogs/:id（需管理员权限），THEN 删除 Blog 及其标签关联
2. WHEN 删除成功，THEN 触发再验证 webhook

### 需求 8: 前端迁移 - 列表页面

**用户故事**: 作为前端开发者，我想将博客列表页面从 Server Actions 迁移到 Go API

#### 验收标准

1. THE 系统 SHALL 替换 `getBlogList`、`getBlogsBySelectedTagName`、`getQueryBlog` 为 Go API 调用
2. THE 系统 SHALL 保持现有的搜索、筛选、分页功能
3. THE 系统 SHALL 使用 React Query 管理数据缓存

### 需求 9: 前端迁移 - 编辑页面

**用户故事**: 作为前端开发者，我想将博客编辑页面从 Server Actions 迁移到 Go API

#### 验收标准

1. THE 系统 SHALL 替换 `getRawBlogBySlug`、`createBlog`、`updateBlogById` 为 Go API 调用
2. THE 系统 SHALL 保持现有的表单验证和错误处理
3. THE 系统 SHALL 在保存成功后刷新列表数据

### 需求 10: 前端迁移 - 详情页面

**用户故事**: 作为前端开发者，我想将博客详情页面从 Server Actions 迁移到 Go API

#### 验收标准

1. THE 系统 SHALL 替换 `getPublishedBlogHTMLBySlug` 为 Go API 调用
2. THE 系统 SHALL 保持现有的样式和评论功能

