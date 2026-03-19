export interface Tag {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface Post {
  id: number
  user_id: number
  title: string
  summary?: string
  cover?: string
  content_markdown: string
  content_html?: string
  tags?: Array<string | Tag> | string
  created_at: string
  updated_at: string
}

export interface PostListResponse {
  list: Post[]
  total: number
  page?: number
  page_size?: number
}

export interface CreatePostRequest {
  title: string
  summary?: string
  cover?: string
  content_markdown: string
  content_html?: string
  tags: string[]
}

export interface UpdatePostRequest {
  title?: string
  summary?: string
  cover?: string
  content_markdown?: string
  content_html?: string
  tags?: string[]
}

export interface CreateTagRequest {
  name: string
}

export interface UpdateTagRequest {
  name: string
}

export interface PostFilters {
  page?: number
  page_size?: number
}
