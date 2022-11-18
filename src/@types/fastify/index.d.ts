import fastify from "fastify";

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate(request: FastifyRequest<unknown>, reply: FastifyReply): Promise<void>
  }
}