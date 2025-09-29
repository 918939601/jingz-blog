import { TagType } from '@prisma/client'

export function getActiveAdminPath(pathname: string) {
  const currentActiveUrl = pathname.split('/').slice(0, 3).join('/')
  return currentActiveUrl
}

export function getActiveMainPath(pathname: string) {
  const currentActiveUrl = pathname.split('/').slice(0, 2).join('/')
  return currentActiveUrl
}

export function parseEditPageTypeFromUrl(url: string): TagType {
  const type = url.split('/')[2].toUpperCase()
  if (type === TagType.BLOG || type === TagType.NOTE) {
    return type
  }
  throw new Error(`解析编辑页面类型错误`)
}
