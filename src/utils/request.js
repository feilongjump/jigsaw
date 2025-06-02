import { addToast } from '@heroui/react'
import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
})

// 请求拦截器
request.interceptors.request.use(
  async (config) => {
    // 每次请求都将携带 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    addToast({
      description: '完了，好像网络有点问题啊',
      color: 'danger',
    })

    return Promise.reject(error)
  },
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const data = response.data.data
    // 2xx 范围内的状态码都会触发该函数。
    // 当发现请求的接口中存在 token 时，将 token 存储到本地
    if (data.token) {
      localStorage.setItem('token', data.token)
    }
    // 直接将 data 返回，这样就不需要每个请求都写 response.data 了
    return data
  },
  (error) => {
    if (!error.response) {
      addToast({
        description: '什么情况，好像网络有点问题啊',
        color: 'danger',
      })
      return Promise.reject(error)
    }

    const errResp = {
      ...error.response.data,
      code: error.status,
    }
    // 超出 2xx 范围的状态码都会触发该函数。
    switch (error.response.status) {
      case 401:
        // 401 表示未登录，跳转到登录页
        addToast({
          description: '请先登录账号',
          color: 'warning',
        })
        if (window.location.pathname !== '/auth/login') {
          window.location.href = '/auth/login'
        }
        break
      case 422:
        // 422 表示验证失败
        break
      default:
        // 直接将错误信息进行展示
        addToast({
          description: error.response.data.message || error.message,
          color: 'danger',
        })
        break
    }

    // 返回错误信息到调用方
    return Promise.reject(errResp)
  },
)

export default request
