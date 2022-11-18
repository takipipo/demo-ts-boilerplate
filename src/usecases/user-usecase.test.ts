import User from '@/entities/user-entity'
import UserRepository from '@/repositories/user-repository'
import UserUseCase from '@/usecases/user-usecase'

jest.mock('@/repositories/user-repository')

describe('UserUseCase', () => {
  const userRepository = jest.mocked(new UserRepository(), true)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('listUser()', () => {
    it('Should return list of user', async () => {
      const users = [new User('nae', 'nae3x', '123456', new Date('2022-01-01'))]
      userRepository.getAll.mockResolvedValue(users)
      const userUseCase = new UserUseCase(userRepository)

      const actual = await userUseCase.listUser()

      const expected = users
      expect(actual).toStrictEqual(expected)
    })

    it('Should return empty list of user', async () => {
      const users = []
      userRepository.getAll.mockResolvedValue(users)
      const userUseCase = new UserUseCase(userRepository)

      const actual = await userUseCase.listUser()

      const expected = users
      expect(actual).toStrictEqual(expected)
    })
  })

  describe('createUser()', () => {
    it('Should create new user', async () => {
      const input = { name: 'nae', username: 'nae3x', password: '123456', birthdate: new Date('2022-01-01')};
      const user = new User(input.name, input.username, input.password, input.birthdate);
      userRepository.create.mockResolvedValue(user);
      const userUseCase = new UserUseCase(userRepository)

      const actual = await userUseCase.createUser(input);

      const expected = user;
      expect(actual).toStrictEqual(expected)
    });
  });
})
