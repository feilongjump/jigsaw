import type { Wallet } from '@/types/ledger'
import { Card, CardBody, CardFooter, CardHeader, Divider } from '@heroui/react'

interface WalletCardProps {
  wallet: Wallet
  onEdit: (wallet: Wallet) => void
  onDelete: (wallet: Wallet) => void
}

export function WalletCard({ wallet, onEdit, onDelete }: WalletCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">{wallet.name}</p>
          <p className="text-small text-default-500">{wallet.currency}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p className="text-2xl font-bold">
          {wallet.balance.toFixed(2)}
        </p>
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-end gap-2">
        <span
          className="cursor-pointer text-lg text-default-400 hover:text-primary"
          onClick={() => onEdit(wallet)}
        >
          <span className="icon-[solar--pen-new-square-line-duotone]" />
        </span>
        <span
          className="cursor-pointer text-lg text-default-400 hover:text-danger"
          onClick={() => onDelete(wallet)}
        >
          <span className="icon-[solar--trash-bin-minimalistic-line-duotone]" />
        </span>
      </CardFooter>
    </Card>
  )
}
