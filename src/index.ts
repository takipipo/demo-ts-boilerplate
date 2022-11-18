import 'reflect-metadata'

import config from '@/config'
import initContainer from '@/container'
import createServer from '@/server'

// Setting up the Typedi Container
initContainer()

// Setting up the Fastify server
const server = createServer()
server.listen({ port: config.port, host: '0.0.0.0' }, err => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
})
