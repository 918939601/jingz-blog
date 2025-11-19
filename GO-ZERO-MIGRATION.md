## go-zero 重构清单

本文件用于跟踪从 Next.js Server Actions + Prisma 迁移到 go-zero 的完整事项，避免遗漏。按主题分组，按优先级排序。勾选即代表完成。

### 0. 方案确认（已定）
- 鉴权：保留 NextAuth。由 NextAuth 在 JWT 回调签发短期自定义 Token（含 `email`、`isAdmin`），前端请求 Go API 时以 `Authorization: Bearer <token>` 方式传递；Go 中间件验签并做管理员授权判定。
- 上传：保留 UploadThing 现方案与路由；权限沿用 `noPermission()` 逻辑。后续如需统一到 Go，再追加改造任务。
- 再验证：新增 Next `POST /api/revalidate` webhook（带 secret），Go 写操作成功后调用，替代 `revalidatePath`。

### 1. 基础设施与项目骨架
- [x] 使用 goctl 初始化 go-zero API 工程（模块名、分层目录）
- [x] 配置环境变量（POSTGRES_DSN、JWT_SECRET、NEXT_REVALIDATE_WEBHOOK、UPLOAD 配置）
- [x] 规划部署与网络：Next ↔ Go（同域反代或 CORS）

### 2. 数据库与模型（复用现有库｜无需迁移表）
- [x] 对齐现有 Prisma schema，生成 go-zero models（不改动表结构）
- [x] 校验连接串与权限（读写、事务、超时配置）
- [x] 核对唯一索引与约束映射到 model 层的校验（如 slug、tagName）
- [x] 为多对多关系（Blog↔BlogTag、Note↔NoteTag）实现查询与写入逻辑（基于现有联结表）

### 3. 鉴权与授权
- [x] NextAuth 保留：在 JWT 回调中签发包含 email 与 isAdmin 的自定义短期 token
- [x] Go 中间件验签（HMAC 或 RSA），注入用户上下文
- [x] 管理员授权检查（等价 `requireAdmin`）

### 4. API 设计（与现有能力一一映射）
Blog
- [x] GET /api/blogs（支持 query、tags[]、published）
- [x] GET /api/blogs/:slug（raw markdown）
- [x] GET /api/blogs/:slug/html（markdown 渲染为 HTML）
- [x] POST /api/blogs（create）
- [x] PUT /api/blogs/:id（update）
- [x] PATCH /api/blogs/:id/publish（toggle）
- [x] DELETE /api/blogs/:id

Note（同 Blog）
- [x] GET /api/notes
- [x] GET /api/notes/:slug
- [x] GET /api/notes/:slug/html
- [x] POST /api/notes
- [x] PUT /api/notes/:id
- [x] PATCH /api/notes/:id/publish
- [x] DELETE /api/notes/:id

Tags（合并 BlogTag/NoteTag）
- [x] GET /api/tags?type=BLOG|NOTE
- [x] POST /api/tags（{ type, tagName }）
- [x] PUT /api/tags/:id（更新名称）
- [x] DELETE /api/tags/:id

Echo
- [ ] GET /api/echos?query=...
- [ ] GET /api/echos/published
- [ ] POST /api/echos
- [ ] PUT /api/echos/:id
- [ ] PATCH /api/echos/:id/publish
- [ ] DELETE /api/echos/:id

Upload（可选：保留 UploadThing 或统一到 Go）
- [ ] POST /api/uploads/image（表单上传、大小限制、返回 URL）

### 5. 服务实现与领域逻辑
- [x] 数据访问层：各模型 CRUD，封装事务
- [x] 文章标签 connect/disconnect 差集逻辑（与当前 Prisma 行为一致）
- [x] 搜索与筛选（标题 keyword、按标签、按发布状态）
- [x] Markdown 渲染（服务端渲染 HTML，主题/代码高亮与现前端样式兼容）

### 6. 再验证（ISR）与缓存
- [x] Next 新增 POST /api/revalidate（带 secret）
- [x] Go 写操作成功后调用 webhook：Blog（/blog、/admin/blog）、Note（/note、/admin/note）、Echo/Tag（/admin/*）

### 7. 前端改造（移除 Server Actions）
- [x] 新建统一 API 客户端（在 Next 端取 session 并附加 Bearer token）
- [x] 后台页面替换 actions：Blog/Note/Tag 列表、搜索、CRUD
- [ ] 前台页面替换 actions：Echo 已发布列表（首页）
- [ ] 后台页面替换 actions：Echo 列表、搜索、CRUD
- [ ] 删除或废弃 `actions/echos/*` 与相关 Prisma 依赖（在 Echo 全部切换后）

### 8. 上传替换（可选）
- [ ] 若统一到 Go：前端改造直传 Go 或签名直传对象存储
- [ ] 若保留 UploadThing：统一权限校验口径

### 9. 文档与 CI/CD
- [x] README 更新：环境变量、启动顺序（Go → Next）
- [x] CI/CD：Go 构建与部署、Next 与 Go 的联通检查

---

#### 对照表（现状能力 → 目标端点）

Blog
- createBlog → POST /api/blogs
- updateBlogById → PUT /api/blogs/:id
- deleteBlogById → DELETE /api/blogs/:id
- toggleBlogPublishedById → PATCH /api/blogs/:id/publish
- getBlogList/getBlogsBySelectedTagName/getQueryBlog → GET /api/blogs
- getRawBlogBySlug → GET /api/blogs/:slug
- getPublishedBlogHTMLBySlug → GET /api/blogs/:slug/html

Note（同上，替换 blogs → notes）

Tags
- createBlogTag/createNoteTag → POST /api/tags
- updateTagNameById → PUT /api/tags/:id
- deleteBlogTagById/deleteNoteTagById → DELETE /api/tags/:id
- getBlogTags/getNoteTags → GET /api/tags?type=...

Echo
- createEcho → POST /api/echos
- updateEchoById → PUT /api/echos/:id
- deleteEchoById → DELETE /api/echos/:id
- toggleEchoPublishedById → PATCH /api/echos/:id/publish
- getAllEchos/getQueryEchos → GET /api/echos
- getAllPublishedEcho → GET /api/echos/published

---

备注：如需迁移认证至 Go 端，请在本清单中新增一组「Go OAuth/Session」任务，并删除 NextAuth 相关项。

---

## 当前状态总结

### ✅ 已完成迁移到 Go 的部分
- **Blog API**：所有端点已实现（列表、详情、创建、更新、删除、发布切换）
- **Note API**：所有端点已实现（列表、详情、创建、更新、删除、发布切换）
- **Tags API**：所有端点已实现（列表、创建、更新、删除）
- **前端 Blog/Note/Tag 页面**：已替换 Server Actions，使用 Go API
- **鉴权与授权**：NextAuth + JWT + Go 中间件已完成
- **再验证机制**：webhook 已集成

### ⏳ 还需要迁移的部分（仅 Echo）
**后端（Go）**
- [ ] 实现 Echo 的 6 个 API 端点
  - GET /api/echos（列表/搜索）
  - GET /api/echos/published（已发布列表）
  - POST /api/echos（创建）
  - PUT /api/echos/:id（更新）
  - PATCH /api/echos/:id/publish（发布切换）
  - DELETE /api/echos/:id（删除）

**前端（Next）- 状态**
- [x] `lib/api/echo.ts` - Go API 客户端已完整实现
- [x] `components/modal/create-echo-modal.tsx` - 已使用 Go API
- [x] `components/modal/edit-echo-modal.tsx` - 已使用 Go API
- [x] `components/modal/delete-echo-modal.tsx` - 已使用 Go API
- [x] `modules/admin/page/admin-echo-page/index.tsx` - 已使用 Go API
- [x] `modules/main/page/main-home-page/index.tsx` - 已使用 Go API
- [ ] 删除 `actions/echos/*` 文件（Server Actions 已不再使用）

### 当前 Next 端 Echo 相关文件
**已完全迁移到 Go API 的文件**
- `lib/api/echo.ts` - ✅ Go API 客户端完整
- `components/modal/create-echo-modal.tsx` - ✅ 使用 Go API
- `components/modal/edit-echo-modal.tsx` - ✅ 使用 Go API
- `components/modal/delete-echo-modal.tsx` - ✅ 使用 Go API
- `modules/admin/page/admin-echo-page/index.tsx` - ✅ 使用 Go API
- `modules/main/page/main-home-page/index.tsx` - ✅ 使用 Go API

**还在的但已不使用的 Server Actions 文件（可删除）**
- `actions/echos/index.ts` - 7 个 Server Actions（已被 Go API 替代）
- `actions/echos/type.ts` - 类型定义（已被 Go API 替代）

---

## API 契约草案（v1）

### 通用约定
- 鉴权：`Authorization: Bearer <token>`（NextAuth JWT 回调签发的自定义 token）
- 分页：`page`（默认 1），`pageSize`（默认 20，最大 100）
- 错误格式：`{ code: string, message: string, details?: any }`
- 时间：ISO8601 字符串；ID 为整型；布尔为 `true|false`

### Echo
- 模型
  - `Echo { id: number, reference: string, content: string, isPublished: boolean, createdAt: string }`
- 列表/搜索
  - `GET /api/echos?query=&page=&pageSize=`
  - 200: `{ items: Echo[], total: number, page: number, pageSize: number }`
- 获取已发布
  - `GET /api/echos/published`
  - 200: `Echo[]`
- 创建
  - `POST /api/echos`
  - body: `{ reference: string, content: string, isPublished?: boolean }`
  - 201: `Echo`
- 更新
  - `PUT /api/echos/:id`
  - body: `{ reference?: string, content?: string, isPublished?: boolean }`
  - 200: `Echo`
- 切换发布状态
  - `PATCH /api/echos/:id/publish`
  - body: `{ isPublished: boolean }`
  - 200: `Echo`
- 删除
  - `DELETE /api/echos/:id`
  - 204

### Blog
- 模型
  - `Blog { id, slug, title, content, isPublished, createdAt, updatedAt, tags: BlogTag[] }`
  - `BlogTag { id, tagName, tagType: 'BLOG' }`
- 列表/筛选/搜索
  - `GET /api/blogs?query=&tags=tag1,tag2&published=&page=&pageSize=`
  - 200: `{ items: Blog[], total, page, pageSize }`（列表可不含 content）
- 详情（raw）
  - `GET /api/blogs/:slug`
  - 200: `Blog`（`content` 为 markdown）
- 详情（HTML）
  - `GET /api/blogs/:slug/html`
  - 200: `Blog & { content: string /* HTML */ }`
- 创建
  - `POST /api/blogs`
  - body: `{ title: string, slug: string, content: string, isPublished: boolean, relatedTagNames: string[] /* <=3 */ }`
  - 201: `Blog`
- 更新
  - `PUT /api/blogs/:id`
  - body: `{ title?: string, slug?: string, content?: string, isPublished?: boolean, relatedTagNames?: string[] }`
  - 200: `Blog`
- 切换发布
  - `PATCH /api/blogs/:id/publish`
  - body: `{ isPublished: boolean }`
  - 200: `Blog`
- 删除
  - `DELETE /api/blogs/:id`
  - 204

### Note（与 Blog 对称，路径 blogs→notes，标签类型为 NOTE）
- `GET /api/notes`（同参） → `{ items, total, page, pageSize }`
- `GET /api/notes/:slug`，`GET /api/notes/:slug/html`
- `POST /api/notes`，`PUT /api/notes/:id`，`PATCH /api/notes/:id/publish`，`DELETE /api/notes/:id`

### Tags（合并 BlogTag/NoteTag）
- 模型
  - `Tag { id: number, tagName: string, tagType: 'BLOG'|'NOTE' }`
- 列表
  - `GET /api/tags?type=BLOG|NOTE`
  - 200: `Tag[]`
- 创建
  - `POST /api/tags`
  - body: `{ tagName: string, type: 'BLOG'|'NOTE' }`
  - 201: `Tag`
- 更新名称
  - `PUT /api/tags/:id`
  - body: `{ tagName: string }`
  - 200: `Tag`
- 删除
  - `DELETE /api/tags/:id`
  - 204

### Upload（保留 UploadThing）
- 仍通过现有 Next 路由；如后续切换到 Go：`POST /api/uploads/image`，表单字段 `file`，返回 `{ url: string }`

### Revalidate Webhook 协议
- `POST /api/revalidate`
- header: `x-revalidate-secret: <secret>`
- body: `{ paths: string[] }` 例如 `{"paths":["/blog","/admin/blog"]}`
- 200: `{ revalidated: true }`

---

## go-zero 目录结构建议

```
cmd/
  api/
    etc/              # 配置（yaml）
    internal/
      config/         # 配置结构体
      handler/        # HTTP handler（按资源分包）
      logic/          # 领域逻辑（Echo、Blog、Note、Tag）
      svc/            # ServiceContext（DB、JWT 校验器、Markdown 渲染器、Revalidate 客户端）
      middleware/     # Auth、Admin 中间件
      types/          # 请求/响应 DTO（可选）
    api.http          # goctl 定义或 swagger
  shared/
    db/               # model、查询封装（goctl model 生成）
    markdown/         # Markdown→HTML 渲染适配
    revalidate/       # 调用 Next webhook 的客户端
```

---

## Next 侧改造清单与代码示例

### 环境变量
- `JWT_SECRET`：用于自定义 token 的签名（Next 与 Go 共用）
- `GO_API_BASE`：Go API 基地址（如 `https://api.example.com`）
- `REVALIDATE_SECRET`：Next revalidate 路由的校验密钥

### 1) NextAuth 签发对外可用的 Bearer Token（含 isAdmin）
> 注：以下为思路示例，真实代码需按 next-auth v5 beta 文档落地。

```ts
// 伪代码：在 auth.ts 中增加 jwt/session 回调，签发短期 token
// 1) 计算 isAdmin：根据 ADMIN_EMAILS 判断
// 2) 使用 JWT_SECRET 签发一个短期（如 15 分钟）的外部 token，放入 session 或 cookies
```

### 2) API 客户端封装（自动附带 Bearer）
```ts
// lib/api/client.ts（示例）
export async function apiFetch(path: string, init: RequestInit = {}) {
  const base = process.env.GO_API_BASE!
  const token = await getExternalBearerToken() // 从 session/cookie 取
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  headers.set('Content-Type', 'application/json')
  const res = await fetch(`${base}${path}`, { ...init, headers, cache: 'no-store' })
  if (!res.ok) throw await res.json().catch(() => new Error(res.statusText))
  if (res.status === 204) return null
  return res.json()
}
```

### 3) Revalidate Webhook（Next 内部路由）
```ts
// app/api/revalidate/route.ts（示例）
// 验证 x-revalidate-secret，读取 body.paths，循环调用 revalidatePath
```

### 4) Echo 前端替换点（示例）
```ts
// modules/admin/page/admin-echo-page/index.tsx 中
// 将原 queryFn: getAllEchos / getQueryEchos
// 替换为：() => apiFetch(`/api/echos?query=${encodeURIComponent(query)}&page=1&pageSize=20`)

// 首页：modules/main/page/main-home-page/index.tsx 中
// const allPublishedEcho = await apiFetch('/api/echos/published')
```

## 迁移进度总结

### 📊 整体进度
- **Blog**: ✅ 100% 完成（后端 + 前端）
- **Note**: ✅ 100% 完成（后端 + 前端）
- **Tags**: ✅ 100% 完成（后端 + 前端）
- **Echo**: ⏳ 50% 完成（前端已完成，后端待实现）

### 🎯 下一步行动
**仅需在 Go 后端实现 Echo API**（前端已全部就绪）

后端（go-zero）
- [ ] 生成 Echo 表的 model（复用现有库）：字段 id, reference, content, isPublished, createdAt
- [ ] 实现列表/搜索：GET /api/echos（query、分页）
- [ ] 实现获取已发布：GET /api/echos/published
- [ ] 实现创建：POST /api/echos（需 Admin 中间件）
- [ ] 实现更新：PUT /api/echos/:id（需 Admin）
- [ ] 实现切换发布：PATCH /api/echos/:id/publish（需 Admin）
- [ ] 实现删除：DELETE /api/echos/:id（需 Admin）
- [ ] 集成 Revalidate 调用：后台变更成功后触发 `/admin/echo` 相关页面

前端（Next）- 清理工作
- [ ] 删除 `actions/echos/index.ts`（Server Actions 已被 Go API 替代）
- [ ] 删除 `actions/echos/type.ts`（类型定义已被 Go API 替代）

接口请求/响应样例
```http
# 列表/搜索
GET /api/echos?query=hello&page=1&pageSize=20
200 { "items": [ {"id":1,"reference":"y1","content":"...","isPublished":true,"createdAt":"2024-01-01T00:00:00Z"} ], "total": 1, "page":1, "pageSize":20 }

# 创建（需管理员）
POST /api/echos
Authorization: Bearer <token>
Content-Type: application/json
{ "reference": "r1", "content": "text", "isPublished": true }
201 { "id":2, "reference":"r1", "content":"text", "isPublished":true, "createdAt":"..." }
```


