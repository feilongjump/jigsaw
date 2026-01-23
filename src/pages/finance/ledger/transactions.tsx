import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { 
  ArrowLeft,
  Filter,
  Calendar
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  ResponsiveContainer, 
  Tooltip, 
  Cell
} from 'recharts'
import { useState, useMemo } from 'react'
import { 
  dailyExpenseData, 
  incomeBreakdown, 
  transactionHistory, 
  totalIncome
} from './components/data'
import type { TransactionItem } from './components/data'

export const Route = createFileRoute('/finance/ledger/transactions')({
  component: TransactionsPage,
})

function TransactionItemCard({ item }: { item: TransactionItem }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-50 flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
         <div className={clsx(
           "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
           item.color === 'rose' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'
         )}>
           <item.icon size={18} strokeWidth={2.5} />
         </div>
         <div>
            <h4 className="text-sm font-semibold text-zinc-900">{item.title}</h4>
            <p className="text-xs text-zinc-400 mt-0.5">{item.category}</p>
         </div>
      </div>
      <span className={clsx(
        "text-sm font-bold",
        item.color === 'rose' ? 'text-rose-500' : 'text-emerald-500'
      )}>
        {item.type === 'income' ? '+' : ''} {Math.abs(item.amount).toFixed(2)}
      </span>
    </motion.div>
  )
}

function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>('all')

  const filteredHistory = useMemo(() => {
    if (activeTab === 'all') return transactionHistory
    
    return transactionHistory.map(group => ({
      ...group,
      items: group.items.filter(item => item.type === activeTab)
    })).filter(group => group.items.length > 0)
  }, [activeTab])

  return (
    <div className="min-h-screen font-sans text-zinc-900">
      
      {/* 1. 自定义 Header */}
      <header className="px-4 py-4 flex items-center justify-between">
        <Link to="/finance/ledger" className="p-2 -ml-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-600">
          <ArrowLeft size={20} />
        </Link>
        <span className="font-bold text-lg">收支明细</span>
        <button className="p-2 -mr-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-600">
          <Filter size={18} />
        </button>
      </header>

      <main className="px-4 pt-2 pb-32 space-y-8">
        
        {/* 2. 每日支出柱状图 (最近30天) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">最近30天支出趋势</h2>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <Calendar size={12} />
              <span>日均 ¥245</span>
            </div>
          </div>
          
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyExpenseData}>
                <defs>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <Tooltip 
                  cursor={{ fill: '#f4f4f5' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: number | undefined) => [`¥${value}`, '支出']}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} fill="url(#expenseGradient)">
                   {dailyExpenseData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.amount > 400 ? '#059669' : 'url(#expenseGradient)'} 
                      fillOpacity={entry.amount > 400 ? 1 : 0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 3. 收入构成进度条 (层叠效果) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">最近30天收入构成</h2>
            <span className="text-sm font-bold text-rose-500">¥{totalIncome.toLocaleString()}</span>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-100">
             {/* 进度条容器 */}
             <div className="flex w-full h-4 rounded-full overflow-hidden mb-6">
                {incomeBreakdown.map((item, i) => (
                  <div 
                    key={i} 
                    className={`${item.color} h-full first:rounded-l-full last:rounded-r-full relative group`} 
                    style={{ width: item.width }}
                  >
                    {/* Hover Tooltip (Simple) */}
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded transition-opacity whitespace-nowrap">
                      {item.label} ¥{item.amount}
                    </div>
                  </div>
                ))}
             </div>

             {/* 图例 */}
             <div className="grid grid-cols-2 gap-3">
                {incomeBreakdown.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-xs text-zinc-600">{item.label}</span>
                    </div>
                    <span className="text-xs font-semibold text-zinc-900">{(item.amount / totalIncome * 100).toFixed(0)}%</span>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* 4. 收支流水列表 (层叠效果) */}
        <section>
           <div className="flex items-center gap-4 mb-4">
              {['all', 'expense', 'income'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={clsx(
                    "text-sm font-medium transition-colors px-3 py-1.5 rounded-full",
                    activeTab === tab 
                      ? "bg-blue-600 text-white" 
                      : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
                  )}
                >
                  {tab === 'all' ? '全部' : tab === 'income' ? '收入' : '支出'}
                </button>
              ))}
           </div>

           <div className="space-y-6">
              {filteredHistory.map((group, groupIndex) => (
                <div key={groupIndex} className="relative">
                  {/* Sticky Date Header */}
                  <div className="py-2 mb-2 flex justify-between items-center">
                     <span className="text-xs font-bold text-zinc-400">{group.date}</span>
                  </div>
                  
                  {/* Cards Stack */}
                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <TransactionItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ))}
           </div>
        </section>
        
      </main>
    </div>
  )
}
