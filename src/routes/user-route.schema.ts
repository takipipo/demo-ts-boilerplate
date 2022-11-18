import { Type, Static } from '@sinclair/typebox'

const listUserReponseSchema = Type.Object({
  data: Type.Array(
    Type.Object({
      id: Type.String(),
      name: Type.String(),
      username: Type.String(),
      password: Type.String(),
      birthdate: Type.String()
    })
  )
})
const createUserBodySchema = Type.Object({
  name: Type.String(),
  username: Type.String(),
  password: Type.String(),
  birthdate: Type.String()
})
type createUserBodyType = Static<typeof createUserBodySchema>
const createUserResposneSchema = Type.Object({
  data: Type.Object({
    id: Type.String()
  })
})

export {
  listUserReponseSchema,
  createUserBodySchema,
  createUserBodyType,
  createUserResposneSchema
}
