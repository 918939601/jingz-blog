# jingz-blog

一个前后端分离的个人博客项目：

- 前台：博客、短笔记、关于页、天气卡片、评论
- 后台：博客 / 笔记 / 标签 / Echo 管理
- 技术组合：Next.js 15 + React 19 + Tailwind CSS 4 + Prisma + NextAuth + go-zero

![首页预览](.github/assets/light-home.png)

## 项目结构

```text
app/                    Next.js App Router 页面与 API Route
components/             通用组件
modules/                页面级模块
config/                 站点文案、元数据、图片与 SVG
lib/                    接口封装、工具函数、鉴权辅助
prisma/                 Prisma schema 与 migrations
server/blogapi/         go-zero 后端服务
public/                 静态资源
```

## 功能概览

- 前台博客列表与详情页
- 前台笔记列表与详情页
- 首页 Echo 展示
- GitHub OAuth 登录后台
- 管理端内容增删改查与发布切换
- UploadThing 图片上传
- Giscus 评论系统
- 天气信息展示
- Go 后端写操作后触发 Next 页面再验证

## 技术栈

### 前端

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- Motion
- TanStack Query
- Prisma
- NextAuth v5 beta

### 后端

- Go 1.24
- go-zero
- PostgreSQL

## 环境要求

- Node.js >= 20
- pnpm
- Go >= 1.24
- PostgreSQL

## 快速开始

### 1. 克隆项目并安装依赖

```bash
git clone <your-repo-url>
cd jingz-blog
pnpm install
```

### 2. 配置 Next 环境变量

复制一份环境变量文件：

```bash
cp .env.example .env.local
```

`.env.local` 最少需要这些字段：

```ini
SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_EMAILS=you@example.com

AUTH_SECRET=replace-me
AUTH_GITHUB_ID=replace-me
AUTH_GITHUB_SECRET=replace-me

NEXT_PUBLIC_GO_API_BASE=http://localhost:8080
GO_API_BASE=http://localhost:8080

REVALIDATE_SECRET=replace-me

UPLOADTHING_TOKEN=replace-me

DATABASE_URL=postgres://username:password@localhost:5432/blog?sslmode=disable
```

说明：

- `NEXT_PUBLIC_ADMIN_EMAILS`：允许进入后台的 GitHub 邮箱白名单，多个邮箱用逗号分隔
- `NEXT_PUBLIC_GO_API_BASE` / `GO_API_BASE`：Next 访问 Go API 的地址，本地默认是 `http://localhost:8080`
- `REVALIDATE_SECRET`：Next 与 Go 共用，用于 `/api/revalidate`
- `AUTH_*`：GitHub OAuth 登录
- `UPLOADTHING_TOKEN`：图片上传用，未配置时上传能力不可用
- `DATABASE_URL`：Prisma 连接 PostgreSQL

### 3. 初始化数据库

```bash
npx prisma migrate dev --name init
pnpm prisma generate
```

### 4. 配置 Go 后端

复制配置文件：

```bash
cp server/blogapi/etc/blogapi.yaml.example server/blogapi/etc/blogapi.yaml
```

然后修改 `server/blogapi/etc/blogapi.yaml` 里的关键字段：

```yaml
Name: blogapi
Host: 0.0.0.0
Port: 8080
Cors:
  - http://localhost:3000
DatabaseDSN: postgres://username:password@localhost:5432/blog?sslmode=disable
AmapKey: your-amap-api-key
DefaultCity: 北京

# AI 可选
AiProvider: glm
AiApiKey: your-api-key
AiModel: glm-4-flash
AiBaseUrl: https://open.bigmodel.cn/api/paas/v4
AiProxyUrl:
```

额外说明：

- `DatabaseDSN` 需要和你的 PostgreSQL 实际连接信息一致
- `AmapKey` 建议配置，否则天气能力不可用或体验不完整
- AI 配置是可选的，只在你使用 AI 接口时需要
- Go 端触发 Next 再验证时会读取系统环境变量里的 `REVALIDATE_SECRET`

本地启动 Go 前，先导出这个变量：

```bash
export REVALIDATE_SECRET=replace-me
```

### 5. 启动 Go 后端

在仓库根目录执行：

```bash
cd server
go run ./blogapi -f blogapi/etc/blogapi.yaml
```

默认监听：

```text
http://localhost:8080
```

### 6. 启动 Next 前端

回到仓库根目录：

```bash
pnpm dev
```

默认访问：

```text
http://localhost:3000
```

## 本地开发注意事项

- 当前首页、文章列表、笔记列表、天气等数据都依赖 Go API
- 如果 `http://localhost:8080` 没启动，前端会出现接口报错，部分页面无法正常展示
- 管理后台依赖 GitHub 登录和邮箱白名单
- UploadThing 与 Giscus 都需要你自己替换成可用配置

## GitHub OAuth 配置

去 GitHub 创建 OAuth App：

- Homepage URL: `http://localhost:3000`
- Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

然后把拿到的值填进 `.env.local`：

```ini
AUTH_GITHUB_ID=your_client_id
AUTH_GITHUB_SECRET=your_client_secret
```

`AUTH_SECRET` 可以通过下面的命令生成：

```bash
npx auth secret
```

## 常用命令

```bash
pnpm dev          # 启动 Next 开发环境（Turbopack）
pnpm dev:no       # 不使用 Turbopack
pnpm build        # 生产构建
pnpm start        # 本地启动生产构建
pnpm lint         # Next lint
pnpm lint:es      # ESLint 检查
pnpm lint:es:fix  # ESLint 自动修复
pnpm ts:check     # TypeScript 类型检查
pnpm prisma generate
npx prisma migrate dev --name <name>
```

## 可自定义内容

- 站点元数据与基础文案：`config/constant/index.ts`
- 首页头像：`config/img/avatar.webp`
- 首页简介：`modules/main/page/main-home-page/internal/bio-section.tsx`
- 关于页内容：`modules/main/page/about-page/index.tsx`
- 联系方式：`components/shared/contact-me/index.tsx`
- 评论仓库配置：`config/constant/index.ts`

## 部署说明

这个项目更适合按下面方式部署：

- Next.js 部署到 Vercel
- Go API 独立部署
- PostgreSQL 使用云数据库
- `NEXT_PUBLIC_GO_API_BASE` / `GO_API_BASE` 指向你的 Go 服务地址
- `REVALIDATE_SECRET` 需要在 Next 与 Go 两边保持一致

## 已知事项

- 仓库里存在 Go 配置文件示例，但真正运行时仍需要你按自己的环境补齐数据库、地图与 AI 配置
- `package.json` 中有 `seed:sample` 脚本；如果你要使用它，先确认本地 `scripts/seed.js` / 脚本路径是否和当前脚本定义一致

## 致谢

- [fuxiaochen](https://github.com/aifuxi/fuxiaochen)
