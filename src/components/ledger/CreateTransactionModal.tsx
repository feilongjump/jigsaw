import type { CreateTransactionRequest, Transaction, TransactionType } from '@/types/ledger'
import { Button, DatePicker, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Tab, Tabs } from '@heroui/react'
import { Icon } from '@iconify/react'
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, now, parseDate } from '@internationalized/date'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getCategories, getLedgerTags, getWallets } from '@/api/ledger'

interface CreateTransactionModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
  onSubmit: (data: CreateTransactionRequest) => void
  loading?: boolean
  transaction?: Transaction | null
}

export function CreateTransactionModal({ isOpen, onOpenChange, onClose, onSubmit, loading, transaction }: CreateTransactionModalProps) {
  const [type, setType] = useState<TransactionType>('expense')
  const [walletId, setWalletId] = useState<string>('')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<Set<string>>(() => new Set([]))
  const [date, setDate] = useState<DateValue>(() => now(getLocalTimeZone()))
  const [remark, setRemark] = useState('')

  const { data: wallets } = useQuery({ queryKey: ['wallets'], queryFn: getWallets })
  const { data: tags } = useQuery({ queryKey: ['ledger_tags'], queryFn: getLedgerTags })
  const { data: categories } = useQuery({
    queryKey: ['categories', type],
    queryFn: () => getCategories(type as 'income' | 'expense'),
    enabled: type === 'income' || type === 'expense',
  })

  useEffect(() => {
    if (!isOpen)
      return
    if (transaction) {
      setType(transaction.type === 'income' || transaction.type === 'expense' ? transaction.type : 'expense')
      setWalletId(String(transaction.wallet_id ?? ''))
      setAmount(String(transaction.amount ?? ''))
      setCategoryId(transaction.category_id ? String(transaction.category_id) : '')
      setSelectedTags(new Set((transaction.tags || []).map(tag => String(tag.id))))
      const dateValue = parseDate(new Date(transaction.transaction_date).toISOString().slice(0, 10))
      setDate(dateValue)
      setRemark(transaction.remark || '')
      return
    }
    setType('expense')
    setWalletId('')
    setAmount('')
    setCategoryId('')
    setSelectedTags(new Set([]))
    setDate(now(getLocalTimeZone()))
    setRemark('')
  }, [transaction, isOpen])

  const handleSubmit = () => {
    if (!walletId || !amount || !date)
      return

    onSubmit({
      wallet_id: Number(walletId),
      amount: Number(amount),
      type: type as 'income' | 'expense',
      category_id: categoryId ? Number(categoryId) : undefined,
      tag_ids: selectedTags.size > 0 ? Array.from(selectedTags).map(tagId => Number(tagId)) : undefined,
      transaction_date: date.toDate(getLocalTimeZone()).toISOString(),
      remark,
    })
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>{transaction ? '编辑记录' : '记一笔'}</ModalHeader>
            <ModalBody>
              <Tabs
                fullWidth
                selectedKey={type}
                onSelectionChange={key => setType(key as TransactionType)}
              >
                <Tab key="expense" title="支出" />
                <Tab key="income" title="收入" />
              </Tabs>

              <Select
                label="钱包"
                placeholder="选择钱包"
                selectedKeys={walletId ? new Set([walletId]) : new Set([])}
                onSelectionChange={(keys) => {
                  const nextKey = Array.from(keys as Set<string>)[0] || ''
                  setWalletId(nextKey)
                }}
              >
                {wallets?.map(wallet => (
                  <SelectItem key={String(wallet.id)}>
                    {wallet.name}
                    {' '}
                    (
                    {wallet.balance}
                    )
                  </SelectItem>
                )) || []}
              </Select>

              <Input
                label="金额"
                placeholder="0.00"
                type="number"
                startContent={(
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">¥</span>
                  </div>
                )}
                value={amount}
                onValueChange={setAmount}
              />

              <Select
                label="分类"
                placeholder="选择分类"
                selectedKeys={categoryId ? new Set([categoryId]) : new Set([])}
                onSelectionChange={(keys) => {
                  const nextKey = Array.from(keys as Set<string>)[0] || ''
                  setCategoryId(nextKey)
                }}
              >
                {categories?.map(category => (
                  <SelectItem key={String(category.id)} startContent={<Icon icon={category.icon || 'solar:tag-line-duotone'} />}>
                    {category.name}
                  </SelectItem>
                )) || []}
              </Select>

              <Select
                label="标签"
                placeholder="选择标签"
                selectionMode="multiple"
                selectedKeys={selectedTags}
                onSelectionChange={(keys) => {
                  setSelectedTags(new Set(keys as Set<string>))
                }}
              >
                {tags?.map(tag => (
                  <SelectItem key={String(tag.id)}>
                    {tag.name}
                  </SelectItem>
                )) || []}
              </Select>

              <DatePicker
                label="日期"
                value={date}
                onChange={value => value && setDate(value)}
                showMonthAndYearPickers
              />

              <Input
                label="备注"
                placeholder="写点备注..."
                value={remark}
                onValueChange={setRemark}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                取消
              </Button>
              <Button color="primary" onPress={handleSubmit} isLoading={loading}>
                {transaction ? '更新' : '保存'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
