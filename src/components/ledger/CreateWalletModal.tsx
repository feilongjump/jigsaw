import type { CreateWalletRequest, UpdateWalletRequest, Wallet } from '@/types/ledger'
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import { useState } from 'react'

interface CreateWalletModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
  onSubmit: (data: CreateWalletRequest | UpdateWalletRequest) => void
  wallet?: Wallet | null
  loading?: boolean
}

export function CreateWalletModal({ isOpen, onOpenChange, onClose, onSubmit, wallet, loading }: CreateWalletModalProps) {
  const [name, setName] = useState(() => wallet?.name || '')
  const [initialBalance, setInitialBalance] = useState('')

  const handleSubmit = () => {
    if (wallet) {
      onSubmit({ name } as UpdateWalletRequest)
    }
    else {
      const balanceValue = initialBalance.trim() ? Number(initialBalance) : undefined
      onSubmit({ name, initial_balance: balanceValue } as CreateWalletRequest)
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">{wallet ? '编辑钱包' : '创建钱包'}</ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="钱包名称"
                placeholder="输入钱包名称"
                variant="bordered"
                value={name}
                onValueChange={setName}
              />
              {!wallet && (
                <Input
                  label="初始金额"
                  placeholder="0.00"
                  type="number"
                  variant="bordered"
                  value={initialBalance}
                  onValueChange={setInitialBalance}
                  startContent={(
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">¥</span>
                    </div>
                  )}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                取消
              </Button>
              <Button color="primary" onPress={handleSubmit} isLoading={loading}>
                {wallet ? '更新' : '创建'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
