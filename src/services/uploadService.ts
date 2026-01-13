import request from '@/utils/request';
import type { ApiResponse } from '@/types/api';

export interface UploadFileResponse {
  id: number;
  name: string;
  url: string;
  size: number;
  mime_type: string;
  owner_type: string;
  owner_id: number;
  created_at: string;
}

// 上传文件
export const uploadFile = (file: File, ownerType: 'users' | 'notes', ownerId?: string): Promise<ApiResponse<UploadFileResponse>> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('owner_type', ownerType);
  if (ownerId) {
    formData.append('owner_id', ownerId);
  }

  return request.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 删除文件
export const deleteFile = (path: string, ownerType: 'users' | 'notes', ownerId?: number): Promise<ApiResponse<void>> => {
  return request.post('/files/delete', {
    path,
    owner_type: ownerType,
    owner_id: ownerId
  });
};
