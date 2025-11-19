# Blog API 测试指南

## 前置条件

1. **Go 后端运行中**
   ```bash
   cd server/blogapi
   air
   ```
   确保后端运行在 `http://localhost:8080`

2. **数据库已连接**
   - PostgreSQL 运行中
   - 数据库表已创建（Blog、BlogTag、BlogBlogTag）

3. **获取管理员 Token**
   - 访问 `http://localhost:3000/admin` 登录
   - 从浏览器开发者工具的 Network 标签查看请求头中的 Authorization token
   - 或者从 cookies 中获取 session

## 测试步骤

### 1. 测试列表 API（无需权限）

```bash
curl -X GET "http://localhost:8080/api/blogs?page=1&pageSize=10" \
  -H "Content-Type: application/json"
```

**预期响应：**
```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "pageSize": 10
}
```

### 2. 测试搜索 API（无需权限）

```bash
curl -X GET "http://localhost:8080/api/blogs?query=test&page=1&pageSize=10" \
  -H "Content-Type: application/json"
```

### 3. 测试创建 API（需要管理员权限）

```bash
curl -X POST "http://localhost:8080/api/blogs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "slug": "my-first-blog",
    "title": "My First Blog",
    "content": "# Hello World\n\nThis is my first blog post.",
    "isPublished": true,
    "relatedTagNames": ["test", "blog"]
  }'
```

**预期响应：**
```json
{
  "id": 1,
  "slug": "my-first-blog",
  "title": "My First Blog",
  "content": "# Hello World\n\nThis is my first blog post.",
  "isPublished": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "tags": [
    {
      "id": 1,
      "tagName": "test",
      "tagType": "BLOG"
    },
    {
      "id": 2,
      "tagName": "blog",
      "tagType": "BLOG"
    }
  ]
}
```

### 4. 测试详情 API（无需权限）

```bash
curl -X GET "http://localhost:8080/api/blogs/my-first-blog" \
  -H "Content-Type: application/json"
```

### 5. 测试 HTML 渲染 API（无需权限）

```bash
curl -X GET "http://localhost:8080/api/blogs/my-first-blog/html" \
  -H "Content-Type: application/json"
```

### 6. 测试更新 API（需要管理员权限）

```bash
curl -X PUT "http://localhost:8080/api/blogs/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Updated Title",
    "content": "# Updated Content"
  }'
```

### 7. 测试发布切换 API（需要管理员权限）

```bash
curl -X PATCH "http://localhost:8080/api/blogs/1/publish" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "isPublished": false
  }'
```

### 8. 测试删除 API（需要管理员权限）

```bash
curl -X DELETE "http://localhost:8080/api/blogs/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 使用 Postman 或 Insomnia 测试

1. 导入以下集合
2. 设置环境变量：
   - `BASE_URL`: `http://localhost:8080`
   - `TOKEN`: 从浏览器获取的 Bearer token

## 常见问题

### 1. 404 Not Found
- 检查路由是否正确注册
- 检查 Go 后端是否重新编译

### 2. 401 Unauthorized
- 需要提供有效的 Bearer token
- 检查 token 是否过期

### 3. 500 Internal Server Error
- 检查数据库连接
- 查看 Go 后端的日志输出

### 4. 数据库错误
- 确保表结构正确
- 检查 SQL 语法

## 测试脚本

运行自动化测试脚本：
```bash
chmod +x test-blog-api.sh
./test-blog-api.sh
```

## 下一步

测试通过后，可以开始迁移前端页面：
1. 迁移博客列表页面
2. 迁移博客编辑页面
3. 迁移博客详情页面
