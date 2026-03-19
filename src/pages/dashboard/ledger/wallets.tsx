import type { CreateWalletRequest, UpdateWalletRequest, Wallet } from '@/types/ledger'
import { addToast, Button, closeToast, Spinner, useDisclosure } from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { createWallet, deleteWallet, getWallets, updateWallet } from '@/api/ledger'
import { CreateWalletModal } from '@/components/ledger/CreateWalletModal'
import { WalletCard } from '@/components/ledger/WalletCard'

export const Route = createFileRoute('/dashboard/ledger/wallets')({
  component: Wallets,
})

function Wallets() {
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null)

  const { data: wallets, isLoading } = useQuery({
    queryKey: ['wallets'],
    queryFn: getWallets,
  })

  const createMutation = useMutation({
    mutationFn: createWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      onClose()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: UpdateWalletRequest }) => updateWallet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      onClose()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      addToast({
        title: '删除钱包成功',
        color: 'success',
      })
    },
  })

  const handleCreate = () => {
    setSelectedWallet(null)
    onOpen()
  }

  const handleEdit = (wallet: Wallet) => {
    setSelectedWallet(wallet)
    onOpen()
  }

  const handleDelete = (wallet: Wallet) => {
    let toastKey: string | null = null
    toastKey = addToast({
      title: `确定要删除钱包 "${wallet.name}" 吗？`,
      color: 'danger',
      timeout: 3000,
      shouldShowTimeoutProgress: true,
      endContent: (
        <Button
          size="sm"
          color="danger"
          variant="flat"
          onPress={() => {
            deleteMutation.mutate(wallet.id)
            if (toastKey)
              closeToast(toastKey)
          }}
        >
          Delete
        </Button>
      ),
    })
  }

  const handleSubmit = (data: CreateWalletRequest | UpdateWalletRequest) => {
    if (selectedWallet) {
      updateMutation.mutate({ id: selectedWallet.id, data: data as UpdateWalletRequest })
    }
    else {
      createMutation.mutate(data as CreateWalletRequest)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-10"><Spinner /></div>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">钱包管理</h1>
        <Button color="primary" onPress={handleCreate} startContent={<span className="icon-[solar--add-circle-line-duotone]" />}>
          创建钱包
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wallets?.map(wallet => (
          <WalletCard
            key={wallet.id}
            wallet={wallet}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <CreateWalletModal
        key={`${selectedWallet?.id ?? 'new'}-${isOpen}`}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        onSubmit={handleSubmit}
        wallet={selectedWallet}
        loading={createMutation.isPending || updateMutation.isPending}
      />

    </div>
  )
}
