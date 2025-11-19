#!/bin/bash

# Tag API 测试脚本
API_URL="http://localhost:8080/api"

echo "=== Tag API 测试 ==="
echo ""

# 1. 获取所有tags
echo "1. 获取所有tags"
curl -X GET "$API_URL/tags" \
  -H "Content-Type: application/json"
echo ""
echo ""

# 2. 获取BLOG类型的tags
echo "2. 获取BLOG类型的tags"
curl -X GET "$API_URL/tags?tagType=BLOG" \
  -H "Content-Type: application/json"
echo ""
echo ""

# 3. 获取NOTE类型的tags
echo "3. 获取NOTE类型的tags"
curl -X GET "$API_URL/tags?tagType=NOTE" \
  -H "Content-Type: application/json"
echo ""
echo ""

# 4. 创建BLOG tag
echo "4. 创建BLOG tag"
curl -X POST "$API_URL/tags" \
  -H "Content-Type: application/json" \
  -d '{
    "tagName": "Go",
    "tagType": "BLOG"
  }'
echo ""
echo ""

# 5. 创建NOTE tag
echo "5. 创建NOTE tag"
curl -X POST "$API_URL/tags" \
  -H "Content-Type: application/json" \
  -d '{
    "tagName": "TypeScript",
    "tagType": "NOTE"
  }'
echo ""
echo ""

# 6. 更新tag（需要替换ID）
echo "6. 更新tag（示例，需要替换实际的ID）"
echo "使用命令: curl -X PUT \"$API_URL/tags/1\" -H \"Content-Type: application/json\" -d '{\"tagName\": \"NewName\"}'"
echo ""

# 7. 删除tag（需要替换ID）
echo "7. 删除tag（示例，需要替换实际的ID）"
echo "使用命令: curl -X DELETE \"$API_URL/tags/1\" -H \"Content-Type: application/json\""
echo ""
