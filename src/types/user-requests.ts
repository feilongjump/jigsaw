export interface CreateUserRequest {
  username: string
  email: string
  password: string
}

export interface UpdateUserRequest {
  avatar?: string
  email?: string
}

export interface UpdatePasswordRequest {
  old_password?: string
  new_password?: string
}
