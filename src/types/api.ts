export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface LoginData {
  token: string;
}

export interface Note {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  // UI 扩展属性
  title?: string;
  date?: string;
  tags?: string[];
  images?: string[];
}

export interface NoteList {
  data: Note[];
  total: number;
  page: number;
  size: number;
}
