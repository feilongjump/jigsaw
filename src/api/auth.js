import request from '@/utils/request'

export function loginAPI(userAuthCreds) {
  return request.post('/auth/login', userAuthCreds)
    .then(() => meAPI())
}

export function meAPI() {
  return request.get('/me')
}

export function signUpAPI(userAuthCreds) {
  return request.post('/auth/sign-up', userAuthCreds)
    .then(() => meAPI())
}
