import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  // * 开发模式下显示 fetch 请求和缓存日志
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  reactStrictMode: false,
}

export default nextConfig
