import { Service } from 'typedi'

import { ExistedUsernameError } from '@/commons/error'
import User from '@/entities/user-entity'
import UserRepositoryInterface from '@/repositories/user-repository.interface'

@Service()
class UserRepository implements UserRepositoryInterface {
  private users: User[] = []
  public getAll(): Promise<User[]> {
    return new Promise<User[]>((resolve, _) => {
      resolve(this.users)
    })
  }
  public async create(user: User): Promise<User> {
    user.id = new Date().getTime().toString()

    const isExistedUsername: User | undefined = this.users.find(dbUser => {
      return dbUser.username === user.username
    })

    if (isExistedUsername) {
      throw new ExistedUsernameError(user.username)
    }

    this.users.push(user)
    return new Promise<User>((resolve, _) => {
      resolve(user)
    })
  }

  public async deleteAll(): Promise<void> {
    this.users = []
  }
}

export default UserRepository
