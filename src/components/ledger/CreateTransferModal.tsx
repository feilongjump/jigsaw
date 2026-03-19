import type { CreateTransferRequest } from '@/types/ledger'
import { addToast, Button, DatePicker, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from '@heroui/react'
import { getLocalTimeZone, now } from '@internationalized/date'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getWallets } from '@/api/ledger'

interface CreateTransferModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
  onSubmit: (data: CreateTransferRequest) => void
  loading?: boolean
}

export function CreateTransferModal({ isOpen, onOpenChange, onClose, onSubmit, loading }: CreateTransferModalProps) {
  const [sourceWalletId, setSourceWalletId] = useState<string>('')
  const [targetWalletId, setTargetWalletId] = useState<string>('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(() => now(getLocalTimeZone()))
  const [remark, setRemark] = useState('')

  const { data: wallets } = useQuery({ queryKey: ['wallets'], queryFn: getWallets })

  const handleSubmit = () => {
    if (!sourceWalletId || !targetWalletId || !amount || !date)
      return
    if (sourceWalletId === targetWalletId) {
      addToast({
        title: '转出和转入钱包不能相同',
        color: 'warning',
      })
      return
    }

    onSubmit({
      source_wallet_id: Number(sourceWalletId),
      target_wallet_id: Number(targetWalletId),
      amount: Number(amount),
      transaction_date: date.toDate().toISOString(),
      remark,
    })
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>转账</ModalHeader>
            <ModalBody>
              <Select
                label="转出钱包"
                placeholder="选择钱包"
                selectedKeys={sourceWalletId ? [sourceWalletId] : []}
                onChange={e => setSourceWalletId(e.target.value)}
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

              <Select
                label="转入钱包"
                placeholder="选择钱包"
                selectedKeys={targetWalletId ? [targetWalletId] : []}
                onChange={e => setTargetWalletId(e.target.value)}
              >
                {wallets?.map(wallet => (
                  <SelectItem key={String(wallet.id)} isDisabled={String(wallet.id) === sourceWalletId}>
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
                保存
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
