# Tag API 测试指南

## 前置条件
1. Go后端服务运行在 `http://localhost:8080`
2. 数据库已连接并包含BlogTag和NoteTag表

## API 端点

### 1. 获取Tags列表
**请求：**
```bash
GET /api/tags?tagType=BLOG
```

**参数：**
- `tagType` (可选): BLOG 或 NOTE

**响应示例：**
```json
[
  {
    "id": 1,
    "tagName": "Go",
    "tagType": "BLOG"
  },
  {
    "id": 2,
    "tagName": "TypeScript",
    "tagType": "BLOG"
  }
]
```

### 2. 创建Tag
**请求：**
```bash
POST /api/tags
Content-Type: application/json

{
  "tagName": "Go",
  "tagType": "BLOG"
}
```

**响应示例：**
```json
{
  "id": 1,
  "tagName": "Go",
  "tagType": "BLOG"
}
```

### 3. 更新Tag
**请求：**
```bash
PUT /api/tags/1
Content-Type: application/json

{
  "tagName": "Golang"
}
```

**响应示例：**
```json
{
  "id": 1,
  "tagName": "Golang",
  "tagType": "BLOG"
}
```

### 4. 删除Tag
**请求：**
```bash
DELETE /api/tags/1
```

**响应示例：**
```json
{
  "id": 1,
  "tagName": "Go",
  "tagType": "BLOG"
}
```

## 使用curl测试

### 获取所有BLOG tags
```bash
curl -X GET "http://localhost:8080/api/tags?tagType=BLOG" \
  -H "Content-Type: application/json"
```

### 获取所有NOTE tags
```bash
curl -X GET "http://localhost:8080/api/tags?tagType=NOTE" \
  -H "Content-Type: application/json"
```

### 创建新tag
```bash
curl -X POST "http://localhost:8080/api/tags" \
  -H "Content-Type: application/json" \
  -d '{
    "tagName": "Go",
    "tagType": "BLOG"
  }'
```

### 更新tag
```bash
curl -X PUT "http://localhost:8080/api/tags/1" \
  -H "Content-Type: application/json" \
  -d '{
    "tagName": "Golang"
  }'
```

### 删除tag
```bash
curl -X DELETE "http://localhost:8080/api/tags/1" \
  -H "Content-Type: application/json"
```

## 前端测试

### 在浏览器中测试
1. 打开 `http://localhost:3000/admin/blog/edit` 创建新blog
2. 在标签选择框中应该能看到从Go后端获取的tags
3. 可以选择现有tags或创建新tags

### 在浏览器控制台测试
```javascript
// 获取tags
fetch('http://localhost:8080/api/tags?tagType=BLOG')
  .then(r => r.json())
  .then(console.log)

// 创建tag
fetch('http://localhost:8080/api/tags', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ tagName: 'Test', tagType: 'BLOG' })
})
  .then(r => r.json())
  .then(console.log)
```

## 常见问题

### 1. 获取tags返回空数组
- 检查数据库中是否有BlogTag或NoteTag数据
- 确认tagType参数是否正确（BLOG或NOTE）

### 2. 创建tag失败
- 检查tagName是否已存在（有UNIQUE约束）
- 确认tagType是否为BLOG或NOTE

### 3. 更新tag失败
- 确认tag ID是否存在
- 检查新的tagName是否与其他tag重复

### 4. 删除tag失败
- 确认tag ID是否存在
- 检查该tag是否被blog或note引用（可能有外键约束）
