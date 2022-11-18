import { Type, Static } from '@sinclair/typebox'

export const defaultErrorResponseSchema = Type.Object({
  error: Type.String(),
  message: Type.String()
})

export type defaultErrorResponseSchemaType = Static<
  typeof defaultErrorResponseSchema
>
