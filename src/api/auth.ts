import type { LoginRequest, LoginResponse, RegisterRequest } from '@/types/auth'
import { request } from '@/api/client'
import { clearAuthToken, getAuthToken, setAuthToken } from '@/api/token'

export { clearAuthToken, getAuthToken, setAuthToken }

export async function login(payload: LoginRequest) {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function register(payload: RegisterRequest) {
  return request<null>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
