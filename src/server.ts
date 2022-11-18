import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions
} from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import fastifyJwt from '@fastify/jwt'

import logger from './logger'
import routes from '@/routes'
import config from '@/config'
import errorHandling from '@/plugins/error-handling'

export default function createServer(): FastifyInstance {
  const server = fastify({ logger })

  server.register(fastifyCors)
  server.register(fastifyHelmet)
  server.register(fastifyJwt, {
    secret: config.jwtSecret
  })
  server.decorate(
    'authenticate',
    async (request: FastifyRequest<unknown>, reply: FastifyReply) => {
      await request.jwtVerify()
    }
  )
  server.register(errorHandling)
  server.register(routes)

  return server
}
