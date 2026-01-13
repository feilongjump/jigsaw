import request from '@/utils/request';
import type { ApiResponse, Note, NoteList } from '@/types/api';

// 获取笔记列表
export const getNotes = (params?: { page?: number; size?: number }): Promise<ApiResponse<NoteList>> => {
  return request.get('/notes', { params });
};

// 获取单条笔记
export const getNote = (id: number | string): Promise<ApiResponse<Note>> => {
  return request.get(`/notes/${id}`);
};

// 创建笔记
export const createNote = (data: { content: string; file_ids?: number[] }): Promise<ApiResponse<Note>> => {
  return request.post('/notes', data);
};

// 更新笔记
export const updateNote = (id: number | string, data: { content: string }): Promise<ApiResponse<Note>> => {
  return request.put(`/notes/${id}`, data);
};

// 删除笔记
export const deleteNote = (id: number | string): Promise<ApiResponse> => {
  return request.delete(`/notes/${id}`);
};
