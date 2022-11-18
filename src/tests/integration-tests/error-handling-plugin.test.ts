import Container from 'typedi'
import build from './setup'

describe('Error handling', () => {
    const server = build()
    describe('Create a new user without auth', () => {
        it('Should return error 400 (JwtVerificationError)', async () => {
            const response = await server.inject({
                url: '/user',
                method: 'POST',
                // headers: {
                //     Authorization: authToken
                // },
                payload: {
                    name: 'Kittiporn K.',
                    username: 'ipol2n',
                    password: 'not-a-password',
                    birthdate: '2022-02-02'
                }
            })

            const actual = response.json()

            expect(response.statusCode).toEqual(400)
            expect(actual.error).toEqual("JwtVerificationError")
        })
    })

    describe('Create a new user with incorrect input', () => {
        it('Should return error 400 (RequestValidationError)', async () => {
            const authToken = `Bearer ${await server.jwt.sign({})}`
            const response = await server.inject({
                url: '/user',
                method: 'POST',
                headers: {
                    Authorization: authToken
                },
                payload: {
                    xname: 'Kittiporn K.',
                    xusername: 'ipol2n',
                    xpassword: 'not-a-password',
                    xbirthdate: '2022-02-02'
                }
            })

            const actual = response.json()

            expect(response.statusCode).toEqual(400)
            expect(actual.error).toEqual("RequestValidationError")
        })
    })

    describe('Unknown Error', () => {
        it('Should return error 500 (UnknownError)', async () => {
            const authToken = `Bearer ${await server.jwt.sign({})}`
            const userRepository = Container.get('UserRepository')
            Container.set('UserRepository', undefined)
            const response = await server.inject({
                url: '/user',
                method: 'POST',
                headers: {
                    Authorization: authToken
                },
                payload: {
                    name: 'Kittiporn K.',
                    username: 'ipol2n',
                    password: 'not-a-password',
                    birthdate: '2022-02-02'
                }
            })

            const actual = response.json()

            expect(response.statusCode).toEqual(500)
            expect(actual.error).toEqual("UnknownError")
            Container.set('UserRepository', userRepository)
        })
    })
})