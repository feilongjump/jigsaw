import type { TransactionListResponse } from '@/types/ledger'
import { Card, CardBody, CardHeader, Spinner } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { getTransactions, getWallets } from '@/api/ledger'

export const Route = createFileRoute('/dashboard/ledger/overview')({
  component: Overview,
})

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function Overview() {
  const { data: wallets, isLoading: isWalletsLoading } = useQuery({ queryKey: ['wallets'], queryFn: getWallets })

  const today = useMemo(() => new Date(), [])
  const monthStart = useMemo(() => new Date(today.getFullYear(), today.getMonth(), 1), [today])

  const monthStartDate = useMemo(() => formatDate(monthStart), [monthStart])
  const monthEndDate = useMemo(() => formatDate(today), [today])

  const { data: transactionsData, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ['transactions', 'recent'],
    queryFn: () => getTransactions({ page: 1, page_size: 5 }),
  })

  const { data: monthlyTransactionsData, isLoading: isMonthlyLoading } = useQuery({
    queryKey: ['transactions', 'month', monthStartDate, monthEndDate],
    queryFn: () => getTransactions({
      page: 1,
      page_size: 100,
      start_date: monthStartDate,
      end_date: monthEndDate,
    }),
  })

  const recentTransactions = useMemo(() => {
    if (!transactionsData)
      return []
    if (Array.isArray(transactionsData))
      return transactionsData
    return (transactionsData as TransactionListResponse).list || []
  }, [transactionsData])

  const monthlyTransactions = useMemo(() => {
    if (!monthlyTransactionsData)
      return []
    if (Array.isArray(monthlyTransactionsData))
      return monthlyTransactionsData
    return (monthlyTransactionsData as TransactionListResponse).list || []
  }, [monthlyTransactionsData])

  const totalAssets = useMemo(() => {
    return wallets?.reduce((sum, wallet) => sum + wallet.balance, 0) || 0
  }, [wallets])

  const monthlyExpense = useMemo(() => {
    return monthlyTransactions
      .filter(item => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0)
  }, [monthlyTransactions])

  const monthlyIncome = useMemo(() => {
    return monthlyTransactions
      .filter(item => item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0)
  }, [monthlyTransactions])

  if (isWalletsLoading || isTransactionsLoading || isMonthlyLoading) {
    return <div className="flex justify-center p-10"><Spinner /></div>
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">概览</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary text-white">
          <CardHeader className="flex-col items-start px-4 pb-0 pt-4">
            <p className="text-tiny font-bold uppercase opacity-70">总资产</p>
          </CardHeader>
          <CardBody className="overflow-visible py-2">
            <h4 className="text-4xl font-bold text-large">
              ¥
              {totalAssets.toFixed(2)}
            </h4>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-col items-start justify-center gap-1">
            <p className="text-tiny font-bold uppercase text-default-500">本月支出</p>
            <h4 className="text-3xl font-bold text-primary">
              ¥
              {monthlyExpense.toFixed(2)}
            </h4>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-col items-start justify-center gap-1">
            <p className="text-tiny font-bold uppercase text-default-500">本月收入</p>
            <h4 className="text-3xl font-bold text-danger">
              ¥
              {monthlyIncome.toFixed(2)}
            </h4>
          </CardBody>
        </Card>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold">最近交易</h2>
        <div className="flex flex-col gap-2">
          {recentTransactions?.map(t => (
            <Card key={t.id} className="w-full">
              <CardBody className="flex flex-row items-center justify-between p-3">
                <div className="flex flex-col">
                  <span className="font-medium">{t.category?.name || t.remark || '无分类'}</span>
                  <span className="text-tiny text-default-400">
                    {new Date(t.transaction_date).toLocaleDateString()}
                    {' '}
                    {t.wallet?.name}
                  </span>
                </div>
                <div className={`font-bold ${t.type === 'expense' ? 'text-primary' : t.type === 'income' ? 'text-danger' : t.type === 'transfer_out' ? 'text-warning' : 'text-success'}`}>
                  {t.type === 'expense' || t.type === 'transfer_out' ? '-' : '+'}
                  {t.amount.toFixed(2)}
                </div>
              </CardBody>
            </Card>
          ))}
          {(!recentTransactions || recentTransactions.length === 0) && <p className="text-default-500">暂无交易</p>}
        </div>
      </div>
    </div>
  )
}
