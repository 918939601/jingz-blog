import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { ADMIN_EMAILS } from '@/config/constant'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  pages: {
    signIn: '/auth/sign-in',
  },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname.startsWith('/admin')) {
        const email = auth?.user?.email
        return !!email && !!ADMIN_EMAILS?.includes(email)
      }
      return true
    },
  },
})
