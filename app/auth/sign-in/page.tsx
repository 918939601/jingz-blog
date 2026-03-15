'use client'

import { GithubIcon, LockKeyhole, RotateCcw } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import HorizontalDividingLine from '@/components/shared/horizontal-dividing-line'
import StarsBackground from '@/components/shared/stars-background'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function LoginPage() {
  return (
    <div className="relative m-auto flex w-full max-w-md flex-col px-4">
      <Card className="relative overflow-hidden p-0">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-[#7fd4c7]/26 via-white/10 to-[#8caad0]/18 blur-2xl dark:from-[#174846]/26 dark:to-[#223d4f]/24" />
        <CardHeader className="relative items-center justify-center px-6 pb-2 pt-8 text-center">
          <span className="paper-label">admin access</span>
          <div className="glass-icon-button mt-5 flex size-14 items-center justify-center">
            <LockKeyhole className="size-6 text-primary" />
          </div>
          <CardTitle className="mt-5 text-3xl">进入后台</CardTitle>
          <CardDescription className="max-w-sm leading-7 text-foreground/60">
            当前仅支持通过 GitHub 账号登录，验证后会进入管理后台。
          </CardDescription>
        </CardHeader>
        <CardFooter className="relative px-6 pb-6">
          <main className="flex w-full flex-col gap-4">
            <Button
              type="button"
              onClick={() => signIn('github', { redirectTo: '/admin' })}
              className="h-11 w-full cursor-pointer rounded-full"
            >
              <GithubIcon />
              GitHub 登录
            </Button>

            <HorizontalDividingLine />

            <Link href="/">
              <Button type="button" variant="outline" className="h-11 w-full cursor-pointer rounded-full">
                <RotateCcw />
                返回前台
              </Button>
            </Link>
          </main>
        </CardFooter>
      </Card>
      <StarsBackground />
    </div>
  )
}
