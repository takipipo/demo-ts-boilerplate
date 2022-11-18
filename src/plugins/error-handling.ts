import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'

import { defaultErrorResponseSchemaType } from '@/routes/error.schema'
import { ApiError } from '@/commons/error'

const errorHandling: FastifyPluginAsync = fp(async (fastify, options) => {
  fastify.setErrorHandler((error, request, reply) => {
    const { name, message, validation } = error

    let statusCode: number
    let response: defaultErrorResponseSchemaType

    // Handle request validation errors
    if (validation) {
      statusCode = 400
      response = {
        error: 'RequestValidationError',
        message: message
      }
    }

    // Handle JWT Authentication errors
    else if (error.name === 'UnauthorizedError') {
      statusCode = 400
      response = {
        error: 'JwtVerificationError',
        message: message
      }
    }

    // Handle expected errors
    else if (error instanceof ApiError) {
      statusCode = error.statusCode
      response = {
        error: name,
        message: message
      }
    }

    // Handle unknown errors
    else {
      console.log(error)

      statusCode = 500
      response = {
        error: 'UnknownError',
        message: message
      }
    }

    reply.status(statusCode).send(response)
  })
})

export default errorHandling
