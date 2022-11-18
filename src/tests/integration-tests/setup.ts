import 'reflect-metadata'
import { FastifyInstance } from 'fastify'

import initContainer from '@/container/index'
import createServer from '@/server'
import config from '@/config'

export const getToken = async (server: FastifyInstance): Promise<string> => {
  const tokenResponse = await server.inject({
    url: '/getToken',
    headers: { host: `localhost:${config.port}` }
  })
  const token = tokenResponse.json().token

  return token
}

export default function build() {
  initContainer()

  const server = createServer()

  return server
}
