import Container from 'typedi'

import UserRepository from '@/repositories/user-repository'
import { listUserReponseSchema } from '@/routes/user-route.schema'
import User from '@/entities/user-entity'
import build from './setup'

describe('User Routes', () => {
  const server = build()

  describe('GET /user', () => {
    describe('Have one user', () => {
      const userRepository = Container.get(UserRepository)
      const user = new User(
        'nae',
        'nae3x',
        '123456',
        new Date('2022-01-01'),
        ''
      )

      beforeAll(() => {
        userRepository.create(user)
      })

      afterAll(() => {
        userRepository.deleteAll()
      })

      it('Should return list of user', async () => {
        const response = await server.inject({
          url: '/user',
          method: 'GET'
        })

        const actual = response.json()

        expect(response.statusCode).toEqual(200)
        expect(actual.data.length).toEqual(1)
        expect(actual).toMatchSchema(listUserReponseSchema)
        expect(actual.data[0].id).toStrictEqual(user.id)
        expect(actual.data[0].name).toStrictEqual(user.name)
        expect(actual.data[0].username).toStrictEqual(user.username)
        expect(actual.data[0].birthdate).toStrictEqual('2022-01-01')
      })
    })

    describe('Have zero user', () => {
      it('Should return empty list of user', async () => {
        const expected = { data: [] }
        const response = await server.inject({ url: '/user', method: 'GET' })

        const actual = response.json()

        expect(response.statusCode).toEqual(200)
        expect(actual).toStrictEqual(expected)
      })
    })
  })

  describe('POST /user', () => {
    let authToken: string
    beforeAll(async () => {
      authToken = `Bearer ${await server.jwt.sign({})}`
    })

    afterEach(async () => {
      const userRepository = Container.get(UserRepository)
      await userRepository.deleteAll()
    })

    describe('Create a new user', () => {
      it('Should return id of new user', async () => {
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

        expect(response.statusCode).toEqual(201)
        expect(actual.data.id).toBeDefined()
      })
    })

    describe('Create a new user with existed username', () => {
      beforeEach(async () => {
        const userRepository = Container.get(UserRepository)
        const user = new User('Kittiporn', 'ipol2n', 'password', new Date('2022-03-04'), '1')
        userRepository.create(user)
      })

      it('Should return error', async () => {
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

        expect(response.statusCode).toEqual(409)
        expect(actual.error).toBeDefined()
      })
    })
  })
})
