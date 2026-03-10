'use client'

import { sayHi } from '@/lib/time'

export default function Greeting() {
  return <span className="text-pink-500">{sayHi()}</span>
}
