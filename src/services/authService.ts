import request from '@/utils/request';
import type { ApiResponse, LoginData } from '@/types/api';

// 登录
export const login = (data: any): Promise<ApiResponse<LoginData>> => {
  return request.post('/auth/login', data);
};

// 注册
export const register = (data: any): Promise<ApiResponse> => {
  return request.post('/auth/register', data);
};

// 修改密码
export const changePassword = (data: any): Promise<ApiResponse> => {
  return request.post('/users/change-password', data);
};

// 更新头像
export const updateAvatar = (file: File): Promise<ApiResponse<any>> => {
  const formData = new FormData();
  formData.append('avatar', file);
  return request.post('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 获取用户信息
export const getUserInfo = (): Promise<ApiResponse<any>> => {
  return request.get('/me');
};
