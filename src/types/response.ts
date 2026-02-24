export interface ApiResponse<T> {
  code: number
  msg: string
  data: T
  errors?: Record<string, string[]>
}
