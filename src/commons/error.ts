// Core business logic layer errors
export class ExistedUsernameError extends Error {
  constructor(readonly username: string) {
    super(`This username(${username}) is already existed in the database`)
    this.name = this.constructor.name
  }
}

// Presenter layer errors

export class ApiError extends Error {
  constructor(readonly statusCode: number, readonly error: Error) {
    super(error.message)
    this.name = error.name
  }
}
