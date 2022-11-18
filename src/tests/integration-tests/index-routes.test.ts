import config from '@/config'
import build from './setup'

describe('Index Routes', () => {
    const server = build()
    describe('GET /', () => {
        it('Should return status = ok', async () => {
            const response = await server.inject({ url: '/health', method: 'GET' })
            const body = response.json()

            expect(response.statusCode).toEqual(200)
            expect(body.status).toBe('ok')
        })
    })

    describe('GET /getToken', () => {
        it('Should return token', async () => {
            const response = await server.inject({
                url: '/getToken',
                method: 'GET',
                headers: {
                    host: `localhost:${config.port}`,
                }
            })

            const body = response.json()

            expect(response.statusCode).toEqual(200)
            expect(body.token).toBeDefined()
        })

        it('Should return nothing here', async () => {
            const response = await server.inject({
                url: '/getToken',
                method: 'GET'
            })

            expect(response.statusCode).toEqual(200)
            expect(response.body).toBe('Nothing here')
        })
    })
})