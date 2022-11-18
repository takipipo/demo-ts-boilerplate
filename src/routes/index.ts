import { FastifyInstance } from 'fastify'
import userRoute from '@/routes/user-route'
import config from '@/config'

export default (fastify: FastifyInstance, _, next) => {
  fastify.route({
    method: 'GET',
    url: '/health',
    handler: (_, reply) => {
      reply.send({ status: 'ok' })
    }
  })
  fastify.route({
    method: 'GET',
    url: '/getToken',
    handler: async (request, reply) => {
      if (request.headers.host === `localhost:${config.port}`) {
        const token = await reply.jwtSign({ foo: 'bar' })
        reply.send({ token })
      } else {
        reply.send('Nothing here')
      }
    }
  })
  fastify.register(userRoute, { prefix: '/user' })
  next()
}
