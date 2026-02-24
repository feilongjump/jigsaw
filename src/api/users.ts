import type { User, UserListResponse } from '@/types/user'
import type { CreateUserRequest, UpdatePasswordRequest, UpdateUserRequest } from '@/types/user-requests'
import { del, get, post, put } from '@/api/client'

export interface UserListQuery {
  page?: number
  page_size?: number
}

export async function getUsers(query?: UserListQuery) {
  return get<UserListResponse | User[]>('/users', {
    page: query?.page,
    page_size: query?.page_size,
  })
}

export async function getCurrentUser() {
  return get<User>('/me')
}

export async function getUser(id: number) {
  return get<User>(`/users/${id}`)
}

export async function createUser(payload: CreateUserRequest) {
  return post<null, CreateUserRequest>('/users', payload)
}

export async function updateUser(id: number, payload: UpdateUserRequest) {
  return put<null, UpdateUserRequest>(`/users/${id}`, payload)
}

export async function deleteUser(id: number) {
  return del<null>(`/users/${id}`)
}

export async function updatePassword(payload: UpdatePasswordRequest) {
  return put<null, UpdatePasswordRequest>('/users/password', payload)
}
