import type { UploadFileResponse } from '@/types/files'
import { upload } from '@/api/client'

export async function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return upload<UploadFileResponse>('/files/upload', formData)
}
