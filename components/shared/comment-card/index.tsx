'use client'

import type { Theme } from '@giscus/react'
import Giscus from '@giscus/react'
import { COMMENT_CARD_REPO, COMMENT_CARD_REPO_ID } from '@/config/constant'
import { useTransitionTheme } from '@/hooks/use-transition-theme'

export default function CommentCard({ term }: { term: string }) {
  const { theme } = useTransitionTheme()

  const commentTheme: Theme = theme === 'light' ? 'light_protanopia' : 'catppuccin_macchiato'

  return (
    <section className="paper-card rounded-[28px] p-5 md:p-6">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="paper-label">comments</span>
        <span className="text-sm text-foreground/52">如果有不同意见或者补充，直接留在这里。</span>
      </div>
      <Giscus
        id="comments"
        repo={COMMENT_CARD_REPO}
        repoId={COMMENT_CARD_REPO_ID}
        category="Announcements"
        categoryId="DIC_kwDOOiAAJM4Cpm1t"
        mapping="specific"
        term={term}
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={commentTheme}
        lang="zh-CN"
        loading="lazy"
      />
    </section>
  )
}
