import { z } from 'zod'

export const CreateEchoSchema = z.object({
    content: z.string().min(1, '内容必填'),
    reference: z.string().min(1, '来源必填'),
    isPublished: z.boolean(), // 去掉 .default(true)
  })
  export type CreateEchoDTO = z.infer<typeof CreateEchoSchema>

export const UpdateEchoSchema = z.object({
  id: z.number().int().positive(),
}).merge(CreateEchoSchema)
export type UpdateEchoDTO = z.infer<typeof UpdateEchoSchema>