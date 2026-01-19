import { createFileRoute, Link } from '@tanstack/react-router'
import { 
  ArrowUpRight, 
  Wallet, 
  CreditCard, 
  ChevronRight,
  Plus
} from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { StatCard } from '@/components/StatCard'
import { AddTransactionModal } from './components/modals/AddTransactionModal'
import { Button, useDisclosure } from '@heroui/react'
import { 
  chartData, 
  expenseData, 
  incomeData, 
  dashboardTransactions as transactions 
} from './data'

export const Route = createFileRoute('/finance/ledger/')({
  component: LedgerPage,
})

// --- 常量与类型定义 ---
// 用户严格约束：收入 = 红色 (Rose), 支出 = 绿色 (Emerald)
const COLOR_INCOME = "text-rose-500"
const COLOR_EXPENSE = "text-emerald-500"
const BG_INCOME = "bg-rose-50"

function LedgerPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="space-y-6">
      {/* 核心卡片: 余额展示 */}
      <section className="relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] p-6 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)] border border-white/50 relative overflow-hidden"
        >
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-zinc-500 text-sm font-medium tracking-wide">总资产</span>
              <span className={`text-xs px-2 py-1 rounded-full ${BG_INCOME} ${COLOR_INCOME} font-bold flex items-center gap-1`}>
                <ArrowUpRight size={12} />
                +12.5%
              </span>
            </div>
            
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-semibold text-zinc-900 tracking-tighter">¥15,888</span>
              <span className="text-lg font-semibold">.88</span>
            </div>

            {/* 迷你走势图 */}
            <div className="h-16 w-full opacity-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip
                    cursor={{ stroke: '#f43f5e', strokeWidth: 1 }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#f43f5e" // Rose-500 用于“收入/增长”
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 月度概览仪表盘 */}
      <section>
        <div className="grid grid-cols-2 gap-4">
          {/* 卡片 1: 支出对比 (绿色) */}
          <StatCard 
            title="本月支出"
            label="上月支出"
            icon={CreditCard}
            data={expenseData}
            theme="emerald"
            delay={0.1}
          />

          {/* 卡片 2: 收入对比 (红色) */}
          <StatCard 
            title="本月收入"
            label="上月收入"
            icon={Wallet}
            data={incomeData}
            theme="rose"
            delay={0.15}
          />
        </div>
      </section>

      {/* 交易记录 - 极简列表视图 */}
      <section>
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-zinc-900 tracking-tight">最近交易</h2>
            <Button 
              size="sm" 
              color="primary" 
              variant="flat"
              className="font-medium bg-primary-50 text-primary-600 dark:bg-primary-900/20"
              startContent={<Plus size={16} />}
              onPress={onOpen}
            >
              记一笔
            </Button>
          </div>
            <Link 
              to="/finance/ledger/transactions"
              className="text-xs font-medium text-zinc-400 hover:text-zinc-600 flex items-center gap-1"
            >
              全部 <ChevronRight size={12} />
            </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {transactions.map((tx, i) => (
            <div key={tx.id} className="flex items-center justify-between py-2 px-1">
                <div className="flex items-center gap-4">
                  <div className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-white/50",
                    tx.iconBg,
                    tx.iconColor
                  )}>
                    <tx.icon size={18} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-sm font-semibold text-zinc-900">{tx.title}</h3>
                    <p className="text-xs text-zinc-400 font-medium">{tx.category}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={clsx(
                    "text-sm font-bold tracking-tight",
                    tx.type === 'income' ? COLOR_INCOME : COLOR_EXPENSE
                  )}>
                    {tx.type === 'income' ? '+' : ''} {Math.abs(tx.amount).toFixed(2)}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-medium mt-0.5">{tx.date}</div>
                </div>
            </div>
          ))}
        </motion.div>
      </section>

      <AddTransactionModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  )
}
