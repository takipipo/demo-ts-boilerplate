import User from '@/entities/user-entity'

export default interface UserRepositoryInterface {
  getAll(): Promise<User[]>
  create(user: User): Promise<User>
}
