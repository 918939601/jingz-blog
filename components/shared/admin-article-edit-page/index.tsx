'use client'

import type { Blog, BlogTag, Note, NoteTag } from '@prisma/client'
import type { ArticleDTO } from './type'
import { zodResolver } from '@hookform/resolvers/zod'
import { TagType } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { File, Loader2, NotebookPen, Tags } from 'lucide-react'
import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { createBlog, updateBlog } from '@/lib/api/blog'
import { createNote, updateNote } from '@/lib/api/note'
import { parseEditPageTypeFromUrl } from '@/lib/url'
import { useModalStore } from '@/store/use-modal-store'
import { ArticleSchema } from './type'

const MarkdownEditor = dynamic(() => import('./internal/markdown-editor'), {
  ssr: false,
  loading: () => (
    <div className="admin-editor-shell">
      <div className="flex h-[70vh] min-h-[560px] items-center justify-center rounded-[22px] border border-white/80 bg-white/72 text-sm text-foreground/58 shadow-[inset_0_1px_0_rgba(255,255,255,0.42)] dark:border-white/12 dark:bg-white/[0.05] dark:text-white/58">
        正在加载编辑器...
      </div>
    </div>
  ),
})

export default function AdminArticleEditPage({
  article,
  relatedArticleTagNames,
  allTags,
}: {
  article: Blog | Note | null
  relatedArticleTagNames?: string[]
  allTags: BlogTag[] | NoteTag[]
}) {
  const router = useRouter()
  const { setModalOpen } = useModalStore()
  const pathname = usePathname()
  const editPageType = parseEditPageTypeFromUrl(pathname)
  const articleTypeLabel = editPageType === TagType.BLOG ? '博客' : '笔记'
  const isEditMode = Boolean(article?.id)

  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: (values: ArticleDTO) => updateArticle(values, editPageType, article?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })

      switch (editPageType) {
        case TagType.BLOG:
          queryClient.invalidateQueries({ queryKey: ['blog-list'] })
          break
        case TagType.NOTE:
          queryClient.invalidateQueries({ queryKey: ['note-list'] })
          break
        default:
          throw new Error(`文章类型错误`)
      }

      toast.success('保存成功')
      router.push(`/admin/${editPageType.toLowerCase()}`)
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(`保存失败 ${error.message}`)
      }
      else {
        toast.error(`保存失败`)
      }
    },
  })

  const form = useForm<ArticleDTO>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: {
      title: article?.title ?? '',
      slug: article?.slug ?? '',
      isPublished: article?.isPublished ?? false,
      relatedTagNames: relatedArticleTagNames ?? [],
      content: article?.content ?? '',
    },
    mode: 'onBlur',
  })
  const isPublished = form.watch('isPublished')

  async function onSubmit(values: ArticleDTO) {
    mutate(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-24"
      >
        <section className="paper-card-strong grid gap-6 p-6 md:grid-cols-[minmax(0,1.2fr)_320px] md:p-8">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="paper-label">editor</span>
              <span className="paper-label !tracking-[0.18em]">{articleTypeLabel}</span>
            </div>
            <h1 className="paper-title mt-5 text-4xl leading-tight md:text-5xl">
              {isEditMode ? `编辑${articleTypeLabel}` : `创建${articleTypeLabel}`}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/64 md:text-base">
              这里负责元信息、标签和正文内容。保存后会回到对应列表页。
            </p>
          </div>

          <div className="paper-card flex flex-col justify-between p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-foreground/42">Status</p>
              <p className="paper-title mt-3 text-3xl">
                {isPublished ? 'Published' : 'Draft'}
              </p>
            </div>
            <div className="mt-6 space-y-2 text-sm text-foreground/58">
              <p>{isEditMode ? '当前是编辑模式' : '当前是创建模式'}</p>
              <p>标签最多选择 3 个。</p>
            </div>
          </div>
        </section>

        <section className="paper-card grid gap-5 p-5 md:grid-cols-2 md:p-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground/66">标题</FormLabel>
                <FormControl>
                  <Input
                    placeholder={`请输入${articleTypeLabel}标题`}
                    {...field}
                    className="rounded-[18px] border-white/80 bg-white/82 dark:border-white/12 dark:bg-white/[0.06]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground/66">Slug</FormLabel>
                <FormControl>
                  <Input
                    placeholder="请输入 slug"
                    {...field}
                    className="rounded-[18px] border-white/80 bg-white/82 dark:border-white/12 dark:bg-white/[0.06]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="paper-card flex flex-row items-center justify-between rounded-[22px] px-4 py-4">
                <div>
                  <FormLabel className="text-sm font-medium text-foreground">是否发布</FormLabel>
                  <p className="mt-1 text-xs text-foreground/48">开启后会在前台公开显示。</p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked)
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="paper-card rounded-[22px] px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Tags className="size-4 text-primary" />
              标签管理
            </div>
            <p className="mt-2 text-xs text-foreground/48">先选择已有标签，缺少时可以直接新建。</p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen('createTagModal')}
              className="mt-4 cursor-pointer rounded-full border-white/80 bg-white/82 dark:border-white/12 dark:bg-white/[0.06]"
            >
              新建标签
            </Button>
          </div>
        </section>

        <section className="paper-card p-5 md:p-6">
          <div className="flex items-center gap-2">
            <Tags className="size-4 text-primary" />
            <h2 className="paper-title text-2xl">标签</h2>
          </div>
          <p className="mt-2 text-sm text-foreground/58">最多选择 3 个，建议保持语义清晰。</p>

          <div className="mt-5">
            <FormField
              control={form.control}
              name="relatedTagNames"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={
                        allTags.map(el => ({
                          label: el.tagName,
                          value: el.tagName,
                        })) ?? []
                      }
                      multiple
                      clearable
                      selectPlaceholder="请选择标签"
                      value={field.value}
                      onValueChange={val =>
                        form.setValue('relatedTagNames', val, {
                          shouldValidate: true,
                        })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="paper-card p-5 md:p-6">
          <div className="mb-5 flex items-center gap-2">
            <NotebookPen className="size-4 text-primary" />
            <h2 className="paper-title text-2xl">内容编辑</h2>
          </div>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MarkdownEditor value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <div className="paper-card-strong sticky bottom-4 flex items-center justify-between gap-4 p-4 md:p-5">
          <div>
            <p className="text-sm font-medium text-foreground">
              {isEditMode ? '准备保存当前修改' : '准备创建新的内容'}
            </p>
            <p className="text-xs text-foreground/48">保存后会返回管理列表。</p>
          </div>

          <Button
            type="submit"
            className="min-w-36 cursor-pointer rounded-full"
            disabled={isPending}
          >
            {isPending
              ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    保存中...
                  </>
                )
              : (
                  <>
                    <File className="mr-2 h-4 w-4" />
                    保存
                  </>
                )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

async function updateArticle(values: ArticleDTO, editPageType: TagType, id: number | undefined) {
  if (id) {
    switch (editPageType) {
      case TagType.BLOG:
        await updateBlog(id, values)
        break
      case TagType.NOTE:
        await updateNote(id, values)
        break
      default:
        throw new Error(`文章类型错误`)
    }
  }
  else {
    switch (editPageType) {
      case TagType.BLOG:
        await createBlog(values as any)
        break
      case TagType.NOTE:
        await createNote(values as any)
        break
      default:
        throw new Error(`文章类型错误`)
    }
  }
}
