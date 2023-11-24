import { z } from "zod"
import { FormData } from "./CreateTransaction"

export const schema: z.ZodType<FormData> = z
  .object({
    recipients: z
      .string()
      .min(1, { message: 'Recepients inputs are empty' })
      .transform((arg) => arg.split('\n').map((r) => r.trim()))
      .refine(
        (arg: string[]) => {
          for (let i = 0; i < arg.length; i++) {
            const recipient = arg[i]
            if (!/^aleo1[a-z0-9]{58}$/.test(recipient)) {
              return false
            }
          }
          return true
        },
        { message: 'Invalid Aleo address' }
      ),
    amounts: z
      .string()
      .min(1, { message: 'Amounts inputs are empty' })
      .transform((arg) => arg.split('\n').map((r) => Number(r.trim())))
      .refine(
        (arg: number[]) => {
          for (let i = 0; i < arg.length; i++) {
            const amount = arg[i]
            if (isNaN(amount) || amount <= 0) return false
          }
          return true
        },
        { message: 'All amounts must be larger than 0' }
      ),
    privateKey: z.string().optional(),
    record: z.string().optional(),
  })
  .superRefine(({ recipients, amounts }, ctx) => {
    if (
      recipients.length !== amounts.length ||
      recipients.length > 15 ||
      amounts.length > 15
    ) {
      const message = 'Recepients and amounts count do not match'
      ctx.addIssue({
        code: 'custom',
        message,
        path: ['recipients'],
      })
      ctx.addIssue({
        code: 'custom',
        message,
        path: ['amounts'],
      })
    }
  })