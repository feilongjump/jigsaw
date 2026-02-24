export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  phone?: string
  created_at: string
  updated_at?: string
  last_login_at?: string
}

export interface UserListResponse {
  list: User[]
  total: number
  page?: number
  page_size?: number
}
