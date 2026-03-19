import { uploadFile as uploadFileApi } from '@/api/files'

interface UploadResult {
  code: number
  data: {
    url: string
    name: string
    id: number
    type: string
    ref_id?: string
  }
  msg: string
}

export async function uploadFile(file: File, type: string, id?: string): Promise<UploadResult> {
  const payload = await uploadFileApi(file)
  return {
    code: 0,
    data: {
      url: payload.path,
      name: file.name,
      id: Date.now(),
      type,
      ref_id: id,
    },
    msg: 'Success',
  }
}
