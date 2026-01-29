import type { ApiResponse } from '@/types/api'
import request from '@/utils/request'
import type { UserWalletType, WalletExtraConfig } from '@/pages/profile/types'

export interface WalletApiItem {
  id: number | string
  name: string
  type: UserWalletType
  balance: number
  liability: number
  remark?: string
  sort?: number
  extra_config?: WalletExtraConfig
  is_hidden?: boolean
  created_at?: string
  updated_at?: string
}

export interface WalletCreatePayload {
  name: string
  type: UserWalletType
  balance: number
  liability: number
  remark?: string
  sort?: number
  extra_config?: WalletExtraConfig
}

export interface WalletUpdatePayload {
  name: string
  is_hidden: boolean
}

export function getWallets(): Promise<ApiResponse<WalletApiItem[]>> {
  return request.get('/users/wallets')
}

export function createWallet(data: WalletCreatePayload): Promise<ApiResponse> {
  return request.post('/users/wallets', data)
}

export function updateWallet(id: number | string, data: WalletUpdatePayload): Promise<ApiResponse> {
  return request.put(`/users/wallets/${id}`, data)
}

export function deleteWallet(id: number | string): Promise<ApiResponse> {
  return request.delete(`/users/wallets/${id}`)
}
