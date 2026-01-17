import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'
import { Header } from '@/components/Header'
import { 
  ArrowUpRight, 
  Wallet, 
  CreditCard, 
  Coffee, 
  ShoppingBag, 
  Car, 
  Smartphone,
  ChevronRight
} from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { getGreeting } from '@/utils/greeting'

import { StatCard } from '@/components/StatCard'

export const Route = createFileRoute('/finance/')({
  component: FinancePage,
})

// --- 常量与类型定义 ---
// 用户严格约束：收入 = 红色 (Rose), 支出 = 绿色 (Emerald)
const COLOR_INCOME = "text-rose-500"
const COLOR_EXPENSE = "text-emerald-500"
const BG_INCOME = "bg-rose-50"
const BG_EXPENSE = "bg-emerald-50"

const chartData = [
  { value: 2400 }, { value: 1398 }, { value: 9800 }, 
  { value: 3908 }, { value: 4800 }, { value: 3800 }, 
  { value: 4300 }, { value: 9300 }, { value: 15888 }
]

// 模拟超出场景：本月支出 6000，上月 5000，超出 120%
const expenseData = {
    current: 6000,
    lastMonth: 5000,
    percentage: 120
}

const incomeData = {
    current: 8500,
    lastMonth: 10000,
    percentage: 85
}

const transactions = [
  { 
    id: 1, 
    title: 'Apple Store', 
    category: '数码产品', 
    amount: -8999.00, 
    type: 'expense', 
    date: '今天, 10:23', 
    icon: Smartphone,
    iconBg: 'bg-zinc-100',
    iconColor: 'text-zinc-600'
  },
  { 
    id: 2, 
    title: '工资收入', 
    category: '科技股份有限公司', 
    amount: 15000.00, 
    type: 'income', 
    date: '昨天', 
    icon: Wallet,
    iconBg: BG_INCOME, // 匹配收入主题色
    iconColor: COLOR_INCOME
  },
  { 
    id: 3, 
    title: '星巴克', 
    category: '餐饮美食', 
    amount: -35.00, 
    type: 'expense', 
    date: '昨天', 
    icon: Coffee,
    iconBg: BG_EXPENSE, // 匹配支出主题色
    iconColor: COLOR_EXPENSE
  },
  { 
    id: 4, 
    title: '滴滴出行', 
    category: '交通出行', 
    amount: -45.00, 
    type: 'expense', 
    date: '10月23日', 
    icon: Car,
    iconBg: BG_EXPENSE,
    iconColor: COLOR_EXPENSE
  },
  { 
    id: 5, 
    title: '7-Eleven', 
    category: '生活日用', 
    amount: -28.50, 
    type: 'expense', 
    date: '10月23日', 
    icon: ShoppingBag, 
    iconBg: BG_EXPENSE,
    iconColor: COLOR_EXPENSE
  },
]

function FinancePage() {
  const { user } = useAuth()
  
  return (
    <div className="min-h-screen font-sans">
      
      {/* 头部区域 */}
      <Header 
        title={user?.username || '访客'}
        subtitle={getGreeting()}
      />

      <main className="px-4 pt-2 pb-32 space-y-6">
        
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
          <div className="flex justify-between items-end mb-2 px-1">
            <h2 className="text-lg font-bold text-zinc-900 tracking-tight">最近交易</h2>
            <Link 
              to="/finance/transactions"
              className="text-xs font-medium text-zinc-400 hover:text-zinc-600 flex items-center gap-1"
            >
              查看全部 <ChevronRight size={12} />
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
      </main>
    </div>
  )
}
