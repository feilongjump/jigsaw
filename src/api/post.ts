import type {
  CreatePostRequest,
  CreateTagRequest,
  Post,
  PostFilters,
  PostListResponse,
  Tag,
  UpdatePostRequest,
  UpdateTagRequest,
} from '@/types/post'
import { del, get, post, put } from '@/api/client'

// Posts
export async function getPosts(filters?: PostFilters) {
  const params: Record<string, string | number | boolean | undefined> = {
    ...filters,
  }
  return get<PostListResponse | Post[]>('/posts', params)
}

export async function getPost(id: number) {
  return get<Post>(`/posts/${id}`)
}

export async function createPost(payload: CreatePostRequest) {
  return post<Post, CreatePostRequest>('/posts', payload)
}

export async function updatePost(id: number, payload: UpdatePostRequest) {
  return put<Post, UpdatePostRequest>(`/posts/${id}`, payload)
}

export async function deletePost(id: number) {
  return del<null>(`/posts/${id}`)
}

// Tags
export async function getTags() {
  return get<Tag[] | { list: Tag[] }>('/tags')
}

export async function createTag(payload: CreateTagRequest) {
  return post<null, CreateTagRequest>('/tags', payload)
}

export async function updateTag(id: number, payload: UpdateTagRequest) {
  return put<null, UpdateTagRequest>(`/tags/${id}`, payload)
}

export async function deleteTag(id: number) {
  return del<null>(`/tags/${id}`)
}
