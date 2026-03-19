import type { CreateTransactionRequest, CreateTransferRequest, Transaction, TransactionListResponse, TransactionType, UpdateTransactionRequest } from '@/types/ledger'
import { addToast, Button, Chip, closeToast, DatePicker, Pagination, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure } from '@heroui/react'
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone } from '@internationalized/date'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { createTransaction, createTransfer, deleteTransaction, getCategories, getLedgerTags, getTransactions, getWallets, updateTransaction } from '@/api/ledger'
import { CreateTransactionModal } from '@/components/ledger/CreateTransactionModal'
import { CreateTransferModal } from '@/components/ledger/CreateTransferModal'

export const Route = createFileRoute('/dashboard/ledger/transactions')({
  component: Transactions,
})

const columns = [
  { name: '日期', uid: 'transaction_date' },
  { name: '类型', uid: 'type' },
  { name: '钱包', uid: 'wallet' },
  { name: '分类', uid: 'category' },
  { name: '金额', uid: 'amount' },
  { name: '备注', uid: 'remark' },
  { name: '操作', uid: 'actions' },
]

function Transactions() {
  const queryClient = useQueryClient()
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onOpenChange: onCreateOpenChange, onClose: onCreateClose } = useDisclosure()
  const { isOpen: isTransferOpen, onOpen: onTransferOpen, onOpenChange: onTransferOpenChange, onClose: onTransferClose } = useDisclosure()

  const [page, setPage] = useState(1)
  const rowsPerPage = 10
  const [walletFilter, setWalletFilter] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<TransactionType | ''>('')
  const [tagFilter, setTagFilter] = useState<string>('')
  const [startDate, setStartDate] = useState<DateValue | null>(null)
  const [endDate, setEndDate] = useState<DateValue | null>(null)
  const [deleteLabel, setDeleteLabel] = useState('')
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const formatDate = (value: { toDate: (tz: string) => Date } | null) => {
    if (!value)
      return ''
    const date = value.toDate(getLocalTimeZone())
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const startDateValue = useMemo(() => formatDate(startDate), [startDate])
  const endDateValue = useMemo(() => formatDate(endDate), [endDate])

  const isDateRangeInvalid = useMemo(() => {
    if (!startDateValue || !endDateValue)
      return false
    return startDateValue > endDateValue
  }, [startDateValue, endDateValue])

  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ['transactions', page, rowsPerPage, walletFilter, categoryFilter, typeFilter, tagFilter, startDateValue, endDateValue],
    queryFn: () => getTransactions({
      page,
      page_size: rowsPerPage,
      wallet_id: walletFilter ? Number(walletFilter) : undefined,
      category_id: categoryFilter ? Number(categoryFilter) : undefined,
      type: typeFilter || undefined,
      tag_id: tagFilter ? Number(tagFilter) : undefined,
      start_date: startDateValue || undefined,
      end_date: endDateValue || undefined,
    }),
    enabled: !isDateRangeInvalid,
  })

  const { data: wallets } = useQuery({ queryKey: ['wallets'], queryFn: getWallets })
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: () => getCategories() })
  const { data: tags } = useQuery({ queryKey: ['ledger_tags'], queryFn: getLedgerTags })

  const walletMap = useMemo(() => {
    return new Map((wallets || []).map(wallet => [wallet.id, wallet]))
  }, [wallets])

  const categoryMap = useMemo(() => {
    return new Map((categories || []).map(category => [category.id, category]))
  }, [categories])

  const transactions = useMemo(() => {
    if (!transactionsData)
      return []
    if (Array.isArray(transactionsData))
      return transactionsData
    return (transactionsData as TransactionListResponse).list || []
  }, [transactionsData])

  const total = useMemo(() => {
    if (!transactionsData)
      return 0
    if (Array.isArray(transactionsData))
      return transactionsData.length
    return (transactionsData as TransactionListResponse).total ?? 0
  }, [transactionsData])

  const pages = useMemo(() => {
    return transactionsData ? Math.ceil(total / rowsPerPage) : 0
  }, [transactionsData, total, rowsPerPage])

  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      onCreateClose()
    },
  })

  const transferMutation = useMutation({
    mutationFn: createTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      onTransferClose()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      addToast({
        title: `删除记录成功：${deleteLabel || '未命名记录'}`,
        color: 'success',
      })
    },
  })

  const handleDelete = (transaction: Transaction) => {
    let toastKey: string | null = null
    setDeleteLabel(transaction.remark || transaction.category?.name || transaction.wallet?.name || `记录${transaction.id}`)
    toastKey = addToast({
      title: '确定要删除这条记录吗？余额将会回滚。',
      color: 'danger',
      timeout: 3000,
      shouldShowTimeoutProgress: true,
      endContent: (
        <Button
          size="sm"
          color="danger"
          variant="flat"
          onPress={() => {
            deleteMutation.mutate(transaction.id)
            if (toastKey)
              closeToast(toastKey)
          }}
        >
          Delete
        </Button>
      ),
    })
  }

  const handleCreateSubmit = (data: CreateTransactionRequest) => {
    createMutation.mutate(data)
  }

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: UpdateTransactionRequest }) => updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      setEditingTransaction(null)
    },
  })

  const handleEditSubmit = (data: CreateTransactionRequest) => {
    if (!editingTransaction)
      return
    updateMutation.mutate({ id: editingTransaction.id, data })
  }

  const handleTransferSubmit = (data: CreateTransferRequest) => {
    transferMutation.mutate(data)
  }

  const handleResetFilters = () => {
    setWalletFilter('')
    setCategoryFilter('')
    setTypeFilter('')
    setTagFilter('')
    setStartDate(null)
    setEndDate(null)
    setPage(1)
  }

  const renderCell = (transaction: Transaction, columnKey: React.Key) => {
    switch (columnKey) {
      case 'transaction_date':
        return `${new Date(transaction.transaction_date).toLocaleDateString()} ${new Date(transaction.transaction_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      case 'type': {
        let color: 'success' | 'danger' | 'default' | 'primary' | 'secondary' | 'warning' = 'default'
        let text = ''
        if (transaction.type === 'income') {
          color = 'danger'
          text = '收入'
        }
        else if (transaction.type === 'expense') {
          color = 'primary'
          text = '支出'
        }
        else if (transaction.type === 'transfer_out') {
          color = 'warning'
          text = '转出'
        }
        else if (transaction.type === 'transfer_in') {
          color = 'secondary'
          text = '转入'
        }
        return <Chip color={color} size="sm" variant="flat">{text}</Chip>
      }
      case 'wallet':
        return transaction.wallet?.name || walletMap.get(transaction.wallet_id)?.name || transaction.wallet_id
      case 'category':
        return transaction.category?.name || (transaction.category_id ? (categoryMap.get(transaction.category_id)?.name || transaction.category_id) : '-')
      case 'amount':
        return (
          <span className={
            transaction.type === 'expense'
              ? 'text-primary'
              : transaction.type === 'income'
                ? 'text-danger'
                : transaction.type === 'transfer_out'
                  ? 'text-warning'
                  : 'text-success'
          }
          >
            {transaction.type === 'expense' || transaction.type === 'transfer_out' ? '-' : '+'}
            {transaction.amount.toFixed(2)}
          </span>
        )
      case 'remark':
        return transaction.remark || '-'
      case 'actions':
        return (
          <div className="relative flex items-center gap-2">
            {(transaction.type === 'income' || transaction.type === 'expense') && (
              <Tooltip color="primary" content="编辑">
                <span
                  className="cursor-pointer text-lg text-primary active:opacity-50"
                  onClick={() => setEditingTransaction(transaction)}
                >
                  <span className="icon-[solar--pen-new-square-line-duotone]" />
                </span>
              </Tooltip>
            )}
            <Tooltip color="danger" content="删除">
              <span
                className="cursor-pointer text-lg text-danger active:opacity-50"
                onClick={() => handleDelete(transaction)}
              >
                <span className="icon-[solar--trash-bin-minimalistic-line-duotone]" />
              </span>
            </Tooltip>
          </div>
        )
      default:
        return typeof columnKey === 'string'
          ? String((transaction as unknown as Record<string, unknown>)[columnKey] ?? '-')
          : '-'
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">交易流水</h1>
        <div className="flex gap-2">
          <Button color="primary" onPress={onCreateOpen} startContent={<span className="icon-[solar--add-circle-line-duotone]" />}>
            记一笔
          </Button>
          <Button color="secondary" onPress={onTransferOpen} startContent={<span className="icon-[solar--card-transfer-line-duotone]" />}>
            转账
          </Button>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Select
          label="钱包"
          placeholder="全部钱包"
          className="max-w-xs"
          size="sm"
          selectedKeys={walletFilter ? [walletFilter] : []}
          onChange={(e) => {
            setWalletFilter(e.target.value)
            setPage(1)
          }}
        >
          {wallets?.map(wallet => (
            <SelectItem key={String(wallet.id)}>{wallet.name}</SelectItem>
          )) || []}
        </Select>
        <Select
          label="分类"
          placeholder="全部分类"
          className="max-w-xs"
          size="sm"
          selectedKeys={categoryFilter ? [categoryFilter] : []}
          onChange={(e) => {
            setCategoryFilter(e.target.value)
            setPage(1)
          }}
        >
          {categories?.map(category => (
            <SelectItem key={String(category.id)}>{category.name}</SelectItem>
          )) || []}
        </Select>
        <Select
          label="类型"
          placeholder="全部类型"
          className="max-w-xs"
          size="sm"
          selectedKeys={typeFilter ? [typeFilter] : []}
          onChange={(e) => {
            setTypeFilter(e.target.value as TransactionType | '')
            setPage(1)
          }}
        >
          <SelectItem key="income">收入</SelectItem>
          <SelectItem key="expense">支出</SelectItem>
          <SelectItem key="transfer_out">转出</SelectItem>
          <SelectItem key="transfer_in">转入</SelectItem>
        </Select>
        <Select
          label="标签"
          placeholder="全部标签"
          className="max-w-xs"
          size="sm"
          selectedKeys={tagFilter ? [tagFilter] : []}
          onChange={(e) => {
            setTagFilter(e.target.value)
            setPage(1)
          }}
        >
          {tags?.map(tag => (
            <SelectItem key={String(tag.id)}>{tag.name}</SelectItem>
          )) || []}
        </Select>
        <DatePicker
          label="开始日期"
          size="sm"
          className="max-w-xs"
          value={startDate}
          onChange={(value) => {
            setStartDate(value)
            setPage(1)
          }}
          showMonthAndYearPickers
        />
        <DatePicker
          label="结束日期"
          size="sm"
          className="max-w-xs"
          value={endDate}
          onChange={(value) => {
            setEndDate(value)
            setPage(1)
          }}
          showMonthAndYearPickers
        />
        <Button
          variant="flat"
          onPress={handleResetFilters}
          startContent={<span className="icon-[solar--restart-line-duotone]" />}
        >
          重置筛选
        </Button>
      </div>

      {isDateRangeInvalid && (
        <div className="text-danger text-sm">开始日期不能晚于结束日期</div>
      )}

      <Table
        aria-label="Transactions table"
        bottomContent={pages > 0
          ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={setPage}
                />
              </div>
            )
          : null}
      >
        <TableHeader columns={columns}>
          {column => <TableColumn key={column.uid}>{column.name}</TableColumn>}
        </TableHeader>
        <TableBody
          items={transactions}
          emptyContent="没有交易记录"
          loadingContent={<Spinner />}
          loadingState={isLoading ? 'loading' : 'idle'}
        >
          {item => (
            <TableRow key={item.id}>
              {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <CreateTransactionModal
        key={`create-${isCreateOpen}`}
        isOpen={isCreateOpen}
        onOpenChange={onCreateOpenChange}
        onClose={onCreateClose}
        onSubmit={handleCreateSubmit}
        loading={createMutation.isPending}
      />

      <CreateTransactionModal
        key={`edit-${editingTransaction?.id || 'none'}`}
        isOpen={!!editingTransaction}
        onOpenChange={(open) => {
          if (!open)
            setEditingTransaction(null)
        }}
        onClose={() => setEditingTransaction(null)}
        onSubmit={handleEditSubmit}
        loading={updateMutation.isPending}
        transaction={editingTransaction}
      />

      <CreateTransferModal
        key={`transfer-${isTransferOpen}`}
        isOpen={isTransferOpen}
        onOpenChange={onTransferOpenChange}
        onClose={onTransferClose}
        onSubmit={handleTransferSubmit}
        loading={transferMutation.isPending}
      />

    </div>
  )
}
