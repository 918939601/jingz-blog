'use client'

import { sayHi } from '@/lib/time'

export default function Greeting() {
  return <span className="text-[#57b8ab] dark:text-[#8ed2c8]">{sayHi()}</span>
}
