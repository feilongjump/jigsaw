import { createFileRoute, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { Tabs, Tab } from "@heroui/react"
import { BookOpen, TrendingUp } from 'lucide-react'
import { Header } from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'
import { getGreeting } from '@/utils/greeting'

export const Route = createFileRoute('/finance')({
  component: FinanceLayout,
})

function FinanceLayout() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  
  // 简单的路径匹配逻辑
  const selectedKey = pathname.includes('/investment') ? 'investment' : 'ledger'
  const isTransactionDetail = pathname.includes('/transactions')

  if (isTransactionDetail) {
    return <Outlet />
  }

  return (
    <div className="min-h-screen font-sans">
      <Header 
        title={user?.username || '访客'}
        subtitle={getGreeting()}
      />

      <main className="px-4 pt-2 pb-32">
        <Tabs 
          selectedKey={selectedKey}
          fullWidth
          classNames={{
            base: "mb-6",
            tabContent: "group-data-[selected=true]:text-blue-500"
          }}
        >
          <Tab 
            key="ledger"
            href='/finance/ledger'
            title={
              <div className="flex items-center space-x-2">
                <BookOpen size={16} />
                <span>账本</span>
              </div>
            }
          />
          <Tab 
            key="investment" 
            href='/finance/investment'
            title={
              <div className="flex items-center space-x-2">
                <TrendingUp size={16} />
                <span>投资</span>
              </div>
            }
          />
        </Tabs>
        
        <Outlet />
      </main>
    </div>
  )
}
