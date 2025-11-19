#!/bin/bash

# 测试blog tags过滤

echo "=== 测试Blog Tags过滤 ==="
echo ""

# 1. 获取所有blogs
echo "1. 获取所有blogs"
curl -X GET "http://localhost:8080/api/blogs" \
  -H "Content-Type: application/json"
echo ""
echo ""

# 2. 获取有"go"标签的blogs
echo "2. 获取有'go'标签的blogs"
curl -X GET "http://localhost:8080/api/blogs?tags=go" \
  -H "Content-Type: application/json"
echo ""
echo ""

# 3. 获取有"react"标签的blogs
echo "3. 获取有'react'标签的blogs"
curl -X GET "http://localhost:8080/api/blogs?tags=react" \
  -H "Content-Type: application/json"
echo ""
echo ""

# 4. 获取有"go"或"react"标签的blogs
echo "4. 获取有'go'或'react'标签的blogs"
curl -X GET "http://localhost:8080/api/blogs?tags=go,react" \
  -H "Content-Type: application/json"
echo ""
