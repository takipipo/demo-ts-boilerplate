import bcrypt from 'bcryptjs';
export default class User {
  public birthdate: Date
  public name: string
  public username: string
  public password: string
  public id?: string

  constructor(
    name: string,
    username: string,
    password: string,
    birthdate: Date,
    id?: string
  ) {
    this.name = name
    this.username = username
    this.password = this._hashPassword(password)
    this.birthdate = birthdate
    this.id = id
  }

  private _hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10)
  }
}
