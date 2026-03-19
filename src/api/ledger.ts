import type {
  Category,
  CreateCategoryRequest,
  CreateLedgerTagRequest,
  CreateTransactionRequest,
  CreateTransferRequest,
  CreateWalletRequest,
  LedgerTag,
  Transaction,
  TransactionFilters,
  TransactionListResponse,
  UpdateCategoryRequest,
  UpdateTransactionRequest,
  UpdateWalletRequest,
  Wallet,
} from '@/types/ledger'
import { del, get, post, put } from '@/api/client'

// Wallets
export async function getWallets() {
  return get<Wallet[]>('/wallets')
}

export async function getWallet(id: number) {
  return get<Wallet>(`/wallets/${id}`)
}

export async function createWallet(payload: CreateWalletRequest) {
  return post<null, CreateWalletRequest>('/wallets', payload)
}

export async function updateWallet(id: number, payload: UpdateWalletRequest) {
  return put<null, UpdateWalletRequest>(`/wallets/${id}`, payload)
}

export async function deleteWallet(id: number) {
  return del<null>(`/wallets/${id}`)
}

// Categories
export async function getCategories(type?: 'income' | 'expense') {
  return get<Category[]>('/categories', { type })
}

export async function createCategory(payload: CreateCategoryRequest) {
  return post<null, CreateCategoryRequest>('/categories', payload)
}

export async function updateCategory(id: number, payload: UpdateCategoryRequest) {
  return put<null, UpdateCategoryRequest>(`/categories/${id}`, payload)
}

export async function deleteCategory(id: number) {
  return del<null>(`/categories/${id}`)
}

// Ledger Tags
export async function getLedgerTags() {
  return get<LedgerTag[]>('/ledger_tags')
}

export async function createLedgerTag(payload: CreateLedgerTagRequest) {
  return post<null, CreateLedgerTagRequest>('/ledger_tags', payload)
}

export async function deleteLedgerTag(id: number) {
  return del<null>(`/ledger_tags/${id}`)
}

// Transactions
export async function getTransactions(filters?: TransactionFilters) {
  // Convert filters to record for query params
  const params: Record<string, string | number | boolean | undefined> = {
    ...filters,
  }
  return get<TransactionListResponse | Transaction[]>('/transactions', params)
}

export async function getTransaction(id: number) {
  return get<Transaction>(`/transactions/${id}`)
}

export async function createTransaction(payload: CreateTransactionRequest) {
  return post<null, CreateTransactionRequest>('/transactions', payload)
}

export async function updateTransaction(id: number, payload: UpdateTransactionRequest) {
  return put<null, UpdateTransactionRequest>(`/transactions/${id}`, payload)
}

export async function deleteTransaction(id: number) {
  return del<null>(`/transactions/${id}`)
}

// Transfers
export async function createTransfer(payload: CreateTransferRequest) {
  return post<null, CreateTransferRequest>('/transfers', payload)
}
