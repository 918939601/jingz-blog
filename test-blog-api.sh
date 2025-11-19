#!/bin/bash

# Blog API 测试脚本
# 使用前请确保：
# 1. Go 后端运行在 http://localhost:8080
# 2. 数据库已连接

BASE_URL="http://localhost:8080/api"

echo "========== Blog API 测试 =========="
echo ""

# 1. 测试列表 API
echo "1. 测试 GET /api/blogs（列表）"
curl -X GET "$BASE_URL/blogs?page=1&pageSize=10" \
  -H "Content-Type: application/json" \
  -s | jq .
echo ""
echo ""

# 2. 测试搜索 API
echo "2. 测试 GET /api/blogs?query=test（搜索）"
curl -X GET "$BASE_URL/blogs?query=test&page=1&pageSize=10" \
  -H "Content-Type: application/json" \
  -s | jq .
echo ""
echo ""

# 3. 测试创建 API（需要管理员权限，这里会失败）
echo "3. 测试 POST /api/blogs（创建 - 需要 Bearer token）"
curl -X POST "$BASE_URL/blogs" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "test-blog",
    "title": "Test Blog",
    "content": "# Test Content",
    "isPublished": true,
    "relatedTagNames": ["test"]
  }' \
  -s | jq .
echo ""
echo ""

# 4. 测试详情 API（需要先有数据）
echo "4. 测试 GET /api/blogs/:slug（详情）"
echo "注：需要先有数据，这里使用 'test-blog' 作为示例"
curl -X GET "$BASE_URL/blogs/test-blog" \
  -H "Content-Type: application/json" \
  -s | jq .
echo ""
echo ""

# 5. 测试 HTML 渲染 API
echo "5. 测试 GET /api/blogs/:slug/html（HTML 渲染）"
curl -X GET "$BASE_URL/blogs/test-blog/html" \
  -H "Content-Type: application/json" \
  -s | jq .
echo ""
echo ""

echo "========== 测试完成 =========="
echo ""
echo "说明："
echo "- 创建、更新、删除、发布切换 API 需要 Bearer token（管理员权限）"
echo "- 获取 token 的方式：通过 NextAuth 登录后，从 session 中获取"
echo "- 详情和列表 API 不需要权限"
