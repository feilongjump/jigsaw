import type { ApiResponse, Note, NoteList } from '@/types/api'
import request from '@/utils/request'

// 获取笔记列表
export function getNotes(params?: { page?: number, size?: number, keyword?: string }): Promise<ApiResponse<NoteList>> {
  return request.get('/notes', { params })
}

// 获取单条笔记
export function getNote(id: number | string): Promise<ApiResponse<Note>> {
  return request.get(`/notes/${id}`)
}

// 创建笔记
export function createNote(data: { content: string, file_ids?: number[] }): Promise<ApiResponse<Note>> {
  return request.post('/notes', data)
}

// 更新笔记
export function updateNote(id: number | string, data: { content: string }): Promise<ApiResponse<Note>> {
  return request.put(`/notes/${id}`, data)
}

// 删除笔记
export function deleteNote(id: number | string): Promise<ApiResponse> {
  return request.delete(`/notes/${id}`)
}

// 置顶/取消置顶笔记
export function pinNote(id: number | string, pinned: boolean): Promise<ApiResponse<Note>> {
  return request.patch(`/notes/${id}/pin`, { pinned })
}
