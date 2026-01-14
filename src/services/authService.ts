import type { ApiResponse, LoginData } from '@/types/api'
import request from '@/utils/request'

// 登录
export function login(data: any): Promise<ApiResponse<LoginData>> {
  return request.post('/auth/login', data)
}

// 注册
export function register(data: any): Promise<ApiResponse> {
  return request.post('/auth/register', data)
}

// 修改密码
export function changePassword(data: any): Promise<ApiResponse> {
  return request.post('/users/change-password', data)
}

// 更新头像
export function updateAvatar(file: File): Promise<ApiResponse<any>> {
  const formData = new FormData()
  formData.append('avatar', file)
  return request.post('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 获取用户信息
export function getUserInfo(): Promise<ApiResponse<any>> {
  return request.get('/me')
}
