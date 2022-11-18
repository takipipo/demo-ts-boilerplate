import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { Container } from 'typedi'

import UserUseCase from '@/usecases/user-usecase'
import {
  createUserBodySchema,
  createUserBodyType,
  createUserResposneSchema,
  listUserReponseSchema
} from '@/routes/user-route.schema'
import { ApiError, ExistedUsernameError } from '@/commons/error'
import { defaultErrorResponseSchema } from '@/routes/error.schema'

const listUserHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const userUseCase = Container.get(UserUseCase)
  const userList = await userUseCase.listUser()
  request.log.debug(`Found ${userList.length} users`)
  const formattedUserList = userList.map(user => {
    return {
      name: user.name,
      username: user.username,
      password: user.password,
      birthdate: user.birthdate.toISOString().split('T')[0],
      id: user.id
    }
  })

  reply.send({
    data: formattedUserList
  })
}

const createUserHandler = async (
  request: FastifyRequest<{ Body: createUserBodyType }>,
  reply: FastifyReply
): Promise<void> => {
  const userUseCase = Container.get(UserUseCase)
  const { name, username, password, birthdate: birthdate_str } = request.body
  const birthdate = new Date(birthdate_str)
  request.log.debug(`Creating user ${name}`)

  try {
    const { id } = await userUseCase.createUser({
      name,
      username,
      password,
      birthdate
    })

    reply.status(201).send({ data: { id } })
  } catch (error) {
    if (error instanceof ExistedUsernameError) {
      throw new ApiError(409, error)
    } else {
      throw error
    }
  }
}

export { listUserHandler, createUserHandler }
export default (fastify: FastifyInstance, _, next) => {
  fastify.route({
    method: 'GET',
    schema: {
      querystring: {},
      params: {},
      response: { 200: listUserReponseSchema }
    },
    url: '/',
    handler: listUserHandler
  })
  fastify.route({
    method: 'POST',
    schema: {
      body: createUserBodySchema,
      querystring: {},
      params: {},
      response: {
        201: createUserResposneSchema,
        409: defaultErrorResponseSchema
      }
    },
    url: '/',
    onRequest: [fastify.authenticate],
    handler: createUserHandler
  })
  next()
}
