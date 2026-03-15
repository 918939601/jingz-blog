import { transformerCopyButton } from '@rehype-pretty/transformers'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeStringify from 'rehype-stringify'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

// * markdown文档渲染配置
export const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkBreaks)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypePrettyCode, {
    //  这里写没用，需要再去 globals.css 中去写一下名字，不然打包压缩会报错
    theme: {
      dark: 'aurora-x',
      light: 'github-light',
    },
    transformers: [
      transformerCopyButton({
        visibility: 'hover',
        feedbackDuration: 3_000,
      }),
    ],
  })
  .use(rehypeKatex)
  .use(rehypeStringify)

// * markdown 主题配置
// * 这里抽出来定义整个 markdown 渲染的主题, 主要还是标题的大小和颜色问题🥹
// * 这里必须要设置成 className 才有 tailwind 的智能提示提示🥺, 先写完主题再换变量名算了
// * customMarkdownTheme
// * 基础配置 => 标题颜色 => 标题大小 => 代码样式 => 字体加粗效果 => 字体斜体 => 超链接 => 图片样式
// ! 没有高亮效果, 没有 HTML 支持, 没有下划线
const className = `
  prose prose-base sm:prose-lg max-w-none dark:prose-invert

  prose-h1:text-3xl sm:prose-h1:text-5xl 
  prose-h2:text-2xl sm:prose-h2:text-4xl 
  prose-h3:text-xl sm:prose-h3:text-3xl 
  prose-h4:text-lg sm:prose-h4:text-2xl 
  prose-h5:text-base sm:prose-h5:text-xl 
  prose-h6:text-base sm:prose-h6:text-xl

prose-h1:text-[#e53935] dark:prose-h1:text-[#ef5350]
prose-h2:text-[#fb8c00] dark:prose-h2:text-[#ffb74d]
prose-h3:text-[#43a047] dark:prose-h3:text-[#66bb6a]
prose-h4:text-[#3495e9] dark:prose-h4:text-[#64b5f6]
prose-h5:text-[#8d5cee] dark:prose-h5:text-[#b39ddb]
prose-h6:text-[#fe5a24] dark:prose-h6:text-[#d7ccc8]

  prose-h1:text-center
  prose-h2:text-center
  prose-h3:text-center
  prose-h4:text-center
  prose-h5:text-center
  prose-h6:text-center

  prose-code:font-normal prose-code:font-mono prose-code:rounded-sm
  prose-strong:font-bold prose-strong:text-pink-500 dark:prose-strong:text-pink-400

prose-a:text-blue-600 prose-a:hover:text-blue-700 
dark:prose-a:text-blue-400 dark:prose-a:hover:text-blue-300 
  prose-a:transition-all

  prose-img:border prose-img:border-dashed prose-img:rounded-sm 
  prose-img:p-1 prose-img:hover:scale-105 prose-img:duration-300 
  prose-img:m-auto

prose-ul:marker:text-gray-500 dark:prose-ul:marker:text-gray-400
`

export const customMarkdownTheme = className
