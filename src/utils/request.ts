import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/types/api';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data;
    if (res.code !== undefined && res.code !== 0) {
      // 优先显示后端返回的 msg，如果存在 errors 对象，则提取第一个错误信息
      let errorMessage = res.msg || '请求失败';
      if (res.errors) {
        const firstErrorKey = Object.keys(res.errors)[0];
        if (firstErrorKey && res.errors[firstErrorKey].length > 0) {
           errorMessage = res.errors[firstErrorKey][0];
        }
      }
      
      // 处理 401 或特定 token 失效 code (1007: 未授权)
      if (res.code === 401 || res.code === 1007) {
         localStorage.removeItem('token');
         localStorage.removeItem('me');
         window.location.href = '/auth/login';
      }
      
      // 返回带有正确错误信息的 Error 对象，供业务层捕获并展示
      return Promise.reject(new Error(errorMessage));
    }
    return res as any; // 返回 data 部分
  },
  (error) => {
    // 处理 HTTP 错误
    const msg = error.response?.data?.msg || error.message || '请求失败';
    
    // 注意：此处移除了 toast.error(msg) 以避免与业务层重复提示
    
    if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('me');
        window.location.href = '/auth/login';
    }
    return Promise.reject(new Error(msg));
  }
);

export default request;
