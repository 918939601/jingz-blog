# Echo 模块迁移完成规划

## 介绍

Echo 模块从 Next.js Server Actions + Prisma 迁移到 Go-Zero 后端已基本完成。本规划用于验证 API 功能、清理遗留代码，并确保前后端完全对接。

## 术语表

- **Echo**: 博客中的短语/引用模块
- **Server Actions**: Next.js 的服务端函数（已被 Go API 替代）
- **Go API**: Go-Zero 后端提供的 RESTful API
- **前端客户端**: `lib/api/echo.ts` 中的 API 调用函数

## 需求

### 需求 1: 验证 Echo API 功能完整性

**用户故事**: 作为开发者，我想验证所有 Echo API 端点都能正常工作，以确保迁移成功

#### 验收标准

1. WHEN 调用 GET /api/echos，THEN 返回分页的 Echo 列表（支持 query 搜索）
2. WHEN 调用 GET /api/echos/published，THEN 返回所有已发布的 Echo
3. WHEN 调用 POST /api/echos，THEN 创建新 Echo 并返回完整数据
4. WHEN 调用 PUT /api/echos/:id，THEN 更新 Echo 并返回更新后的数据
5. WHEN 调用 PATCH /api/echos/:id/publish，THEN 切换发布状态并返回更新后的数据
6. WHEN 调用 DELETE /api/echos/:id，THEN 删除 Echo 并触发再验证

### 需求 2: 清理遗留的 Server Actions 文件

**用户故事**: 作为开发者，我想删除不再使用的 Server Actions 文件，以保持代码库整洁

#### 验收标准

1. THE 系统 SHALL 删除 `actions/echos/index.ts` 文件
2. THE 系统 SHALL 删除 `actions/echos/type.ts` 文件
3. THE 系统 SHALL 确保前端所有引用都已迁移到 Go API

### 需求 3: 更新迁移文档

**用户故事**: 作为项目维护者，我想更新迁移文档，标记 Echo 模块已完成迁移

#### 验收标准

1. THE 系统 SHALL 更新 `GO-ZERO-MIGRATION.md` 中 Echo 部分的完成状态
2. THE 系统 SHALL 标记所有 Echo 相关任务为已完成
3. THE 系统 SHALL 更新当前状态总结部分

