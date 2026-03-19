export interface Wallet {
  id: number
  user_id: number
  name: string
  balance: number
  currency: string
  created_at: string
  updated_at: string
}

export type CategoryType = 'income' | 'expense'

export interface Category {
  id: number
  user_id: number
  name: string
  type: CategoryType
  icon?: string
  parent_id?: number
  created_at: string
  updated_at: string
}

export interface LedgerTag {
  id: number
  user_id: number
  name: string
  created_at: string
  updated_at: string
}

export type TransactionType = 'income' | 'expense' | 'transfer_out' | 'transfer_in'

export interface Transaction {
  id: number
  user_id: number
  wallet_id: number
  amount: number
  type: TransactionType
  category_id?: number
  transaction_date: string
  remark?: string
  transfer_id?: string
  tags?: LedgerTag[]
  wallet?: Wallet
  category?: Category
  created_at: string
  updated_at: string
}

export interface TransactionListResponse {
  list: Transaction[]
  total: number
  page?: number
  page_size?: number
}

export interface CreateWalletRequest {
  name: string
  currency?: string
  initial_balance?: number
}

export interface UpdateWalletRequest {
  name: string
}

export interface CreateCategoryRequest {
  name: string
  type: CategoryType
  icon?: string
  parent_id?: number
}

export interface UpdateCategoryRequest {
  name: string
  type: CategoryType
  icon?: string
  parent_id?: number
}

export interface CreateLedgerTagRequest {
  name: string
}

export interface CreateTransactionRequest {
  wallet_id: number
  amount: number
  type: 'income' | 'expense'
  category_id?: number
  transaction_date: string
  remark?: string
  tag_ids?: number[]
}

export interface UpdateTransactionRequest {
  wallet_id: number
  amount: number
  type: 'income' | 'expense'
  category_id?: number
  transaction_date: string
  remark?: string
  tag_ids?: number[]
}

export interface CreateTransferRequest {
  source_wallet_id: number
  target_wallet_id: number
  amount: number
  transaction_date: string
  remark?: string
}

export interface TransactionFilters {
  wallet_id?: number
  category_id?: number
  tag_id?: number
  type?: TransactionType
  start_date?: string
  end_date?: string
  page?: number
  page_size?: number
}
