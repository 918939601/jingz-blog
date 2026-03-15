'use client'

import type { NoteTag } from '@prisma/client'
import type { Dispatch, SetStateAction } from 'react'
import type {
  CarouselApi,
} from '@/components/ui/carousel'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { NoteTagItemToggle } from '@/components/shared/tag-item-toggle'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

export function NoteTagsContainer({
  noteTagList,
  selectedTags,
  setSelectedTags,
}: {
  noteTagList: NoteTag[]
  selectedTags: string[]
  setSelectedTags: Dispatch<SetStateAction<string[]>>
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(1)

  const noteTags = noteTagList.map(tag => tag.tagName)
  const count = api?.scrollSnapList().length ?? 0

  useEffect(() => {
    if (!api) {
      return
    }

    const updateCurrent = () => {
      setCurrent(api.selectedScrollSnap() + 1)
    }

    api.on('select', updateCurrent)

    return () => {
      api.off('select', updateCurrent)
    }
  }, [api])

  return (
    <section className="paper-card p-5">
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="paper-label">tags</span>
        <span className="text-sm text-foreground/52">按标签过滤笔记列表</span>
      </div>
      <Carousel
        opts={{
          align: 'start',
          dragFree: true,
        }}
        setApi={setApi}
        className="relative"
      >
        <span
          className={cn(
            'absolute bottom-0 left-0 top-0 z-10 w-12',
            'bg-gradient-to-r from-[#f6f3ee] to-transparent dark:from-[#10191b]',
            'pointer-events-none transition-colors duration-300 ease-in-out',
            current === 1 && 'hidden',
          )}
        />

        <CarouselContent className="max-w-[calc(100vw-4rem)] shrink-0 w-fit">
          {noteTags.length === 0
            ? (
                <CarouselItem className="basis-full">
                  <div className="flex min-h-24 w-full flex-col items-center justify-center rounded-[20px] border border-dashed border-black/8 bg-black/[0.015] px-4 text-center dark:border-white/10 dark:bg-white/[0.015]">
                    <span className="paper-label">empty</span>
                    <p className="mt-3 text-sm text-foreground/52">还没有可用于筛选的笔记标签</p>
                  </div>
                </CarouselItem>
              )
            : (
                noteTags.map((tag, i) => (
                  <CarouselItem className="basis-auto" key={tag}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0, transition: {
                        type: 'spring',
                        stiffness: 50,
                        damping: 12,
                        mass: 0.5,
                        delay: i * 0.15,
                      } }}
                    >
                      <NoteTagItemToggle
                        tag={tag}
                        selectedTags={selectedTags}
                        setSelectedTags={setSelectedTags}
                      />
                    </motion.div>
                  </CarouselItem>
                ))
              )}
        </CarouselContent>
        <span
          className={cn(
            'absolute bottom-0 right-0 top-0 z-10 w-12',
            'bg-gradient-to-l from-[#f6f3ee] to-transparent dark:from-[#10191b]',
            'pointer-events-none transition-colors duration-300 ease-in-out',
            current === count && 'hidden',
          )}
        />
      </Carousel>
    </section>
  )
}
