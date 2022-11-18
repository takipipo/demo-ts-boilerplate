import { Service, Inject } from 'typedi'

import User from '@/entities/user-entity'
import UserRepositoryInterface from '@/repositories/user-repository.interface'
import logger from '@/logger'

@Service()
class UserUseCase {
  constructor(
    @Inject('UserRepository')
    private userRepository: UserRepositoryInterface
  ) { }

  public async listUser(): Promise<User[]> {
    const userList = await this.userRepository.getAll()
    logger.debug(`Found ${userList.length} users`)
    return userList
  }

  public async createUser(input: {
    name: string
    username: string
    password: string
    birthdate: Date
  }): Promise<User> {
    logger.debug({ data: input }, 'Creating user ...')
    const { name, username, password, birthdate } = input

    const user = await this.userRepository.create(
      new User(name, username, password, birthdate)
    )

    return user
  }
}

export default UserUseCase
