'use client'

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
import { GithubIcon, RotateCcw } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="flex flex-col m-auto">
      <Card className="relative w-[320px] rounded-3xl py-4 sm:w-full sm:min-w-[360px] sm:max-w-none">
        <CardHeader className="flex justify-center items-center">
          <CardTitle>
            <h3>你要登录喵?</h3>
          </CardTitle>
          <CardDescription>暂时仅支持GitHub登录喵 OvO</CardDescription>
        </CardHeader>
        <CardFooter>
          <main className="flex flex-col w-full gap-4">
            <Button
              type="button"
              onClick={() => signIn('github', { redirectTo: '/admin' })}
              className="cursor-pointer"
            >
              <GithubIcon />
              GitHub登录
            </Button>

            <HorizontalDividingLine />

            <Link href="/">
              <Button type="button" className="w-full cursor-pointer">
                <RotateCcw />
                回到过去喵~
              </Button>
            </Link>
          </main>
        </CardFooter>
      </Card>
      <StarsBackground />
    </div>
  )
}
