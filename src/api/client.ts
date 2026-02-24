import type { ApiResponse } from '@/types/response'
import { getAuthToken } from '@/api/token'

const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const API_BASE_URL = RAW_BASE_URL ? RAW_BASE_URL.replace(/\/$/, '') : ''

export class ApiRequestError extends Error {
  code?: number
  fieldErrors?: Record<string, string[]>

  constructor(message: string, code?: number, fieldErrors?: Record<string, string[]>) {
    super(message)
    this.code = code
    this.fieldErrors = fieldErrors
  }
}

export function getApiErrorMessage(error: unknown) {
  if (error instanceof ApiRequestError) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return '请求失败'
}

export function getApiFieldErrors(error: unknown) {
  if (error instanceof ApiRequestError) {
    return error.fieldErrors
  }
  return undefined
}

function buildHeaders(init?: HeadersInit) {
  const headers = new Headers(init)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const token = getAuthToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  return headers
}

function buildFormHeaders(init?: HeadersInit) {
  const headers = new Headers(init)
  const token = getAuthToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  return headers
}

function buildQuery(params?: Record<string, string | number | boolean | undefined>) {
  if (!params) {
    return ''
  }
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) {
      return
    }
    searchParams.append(key, String(value))
  })
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export async function request<T>(path: string, options: RequestInit = {}) {
  if (!API_BASE_URL) {
    throw new ApiRequestError('VITE_API_BASE_URL 未配置')
  }
  const headers = buildHeaders(options.headers)
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })
  const text = await response.text()
  const payload = text ? (JSON.parse(text) as ApiResponse<T>) : null

  if (!response.ok) {
    const message = payload?.msg || response.statusText || '请求失败'
    throw new ApiRequestError(message, payload?.code ?? response.status, payload?.errors)
  }

  if (payload && payload.code !== 200) {
    throw new ApiRequestError(payload.msg || '请求失败', payload.code, payload.errors)
  }

  if (payload) {
    return payload.data
  }

  return undefined as T
}

export async function upload<T>(path: string, formData: FormData, options: RequestInit = {}) {
  if (!API_BASE_URL) {
    throw new ApiRequestError('VITE_API_BASE_URL 未配置')
  }
  const headers = buildFormHeaders(options.headers)
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    method: options.method ?? 'POST',
    body: formData,
    headers,
  })
  const text = await response.text()
  const payload = text ? (JSON.parse(text) as ApiResponse<T>) : null

  if (!response.ok) {
    const message = payload?.msg || response.statusText || '请求失败'
    throw new ApiRequestError(message, payload?.code ?? response.status, payload?.errors)
  }

  if (payload && payload.code !== 200) {
    throw new ApiRequestError(payload.msg || '请求失败', payload.code, payload.errors)
  }

  if (payload) {
    return payload.data
  }

  return undefined as T
}

export async function get<T>(path: string, params?: Record<string, string | number | boolean | undefined>) {
  return request<T>(`${path}${buildQuery(params)}`, {
    method: 'GET',
  })
}

export async function post<T, P>(path: string, payload: P) {
  return request<T>(path, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function put<T, P>(path: string, payload: P) {
  return request<T>(path, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function del<T>(path: string) {
  return request<T>(path, {
    method: 'DELETE',
  })
}
