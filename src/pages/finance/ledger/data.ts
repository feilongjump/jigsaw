
import { 
  Wallet,
  Coffee, 
  ShoppingBag, 
  Car, 
  Smartphone,
  Utensils,
  Home
} from 'lucide-react'

// --- Types ---

export interface TransactionItem {
  id: number
  title: string
  category: string
  amount: number
  type: 'expense' | 'income'
  date: string
  icon: any
  // For UI styling
  color?: 'emerald' | 'rose' // Used in transactions.tsx
  iconBg?: string // Used in index.tsx
  iconColor?: string // Used in index.tsx
}

export interface DailyTransactionGroup {
  date: string
  items: TransactionItem[]
}

// --- Mock Data ---

export const chartData = [
  { value: 2400 }, { value: 1398 }, { value: 9800 }, 
  { value: 3908 }, { value: 4800 }, { value: 3800 }, 
  { value: 4300 }, { value: 9300 }, { value: 15888 }
]

export const expenseData = {
    current: 6000,
    lastMonth: 5000,
    percentage: 120
}

export const incomeData = {
    current: 8500,
    lastMonth: 10000,
    percentage: 85
}

// Recent transactions for the dashboard (index.tsx)
export const dashboardTransactions: TransactionItem[] = [
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
    iconBg: 'bg-rose-50', 
    iconColor: 'text-rose-500'
  },
  { 
    id: 3, 
    title: '星巴克', 
    category: '餐饮美食', 
    amount: -35.00, 
    type: 'expense', 
    date: '昨天', 
    icon: Coffee,
    iconBg: 'bg-emerald-50', 
    iconColor: 'text-emerald-500'
  },
  { 
    id: 4, 
    title: '滴滴出行', 
    category: '交通出行', 
    amount: -45.00, 
    type: 'expense', 
    date: '10月23日', 
    icon: Car,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500'
  },
  { 
    id: 5, 
    title: '7-Eleven', 
    category: '生活日用', 
    amount: -28.50, 
    type: 'expense', 
    date: '10月23日', 
    icon: ShoppingBag, 
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500'
  },
]

// Detailed transaction history for the transactions page
export const transactionHistory: DailyTransactionGroup[] = [
  { date: '今天', items: [
    { id: 1, title: 'Apple Store', category: '数码产品', amount: -8999.00, type: 'expense', date: '今天', icon: Smartphone, color: 'emerald' },
    { id: 2, title: '7-Eleven', category: '生活日用', amount: -28.50, type: 'expense', date: '今天', icon: ShoppingBag, color: 'emerald' },
  ]},
  { date: '昨天', items: [
    { id: 3, title: '工资收入', category: '科技股份有限公司', amount: 15000.00, type: 'income', date: '昨天', icon: Wallet, color: 'rose' },
    { id: 4, title: '星巴克', category: '餐饮美食', amount: -35.00, type: 'expense', date: '昨天', icon: Coffee, color: 'emerald' },
  ]},
  { date: '10月23日', items: [
    { id: 5, title: '滴滴出行', category: '交通出行', amount: -45.00, type: 'expense', date: '10月23日', icon: Car, color: 'emerald' },
    { id: 6, title: '山姆会员店', category: '家庭采买', amount: -456.00, type: 'expense', date: '10月23日', icon: Home, color: 'emerald' },
  ]},
  { date: '10月22日', items: [
    { id: 7, title: '海底捞', category: '聚餐', amount: -328.00, type: 'expense', date: '10月22日', icon: Utensils, color: 'emerald' },
  ]},
]

// Daily expense data for the chart
export const dailyExpenseData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}日`,
  amount: Math.floor(Math.random() * 500) + 50, 
}))

// Income breakdown data
export const incomeBreakdown = [
  { label: '工资收入', amount: 15000, color: 'bg-rose-500', width: '70%' },
  { label: '理财收益', amount: 3200, color: 'bg-rose-400', width: '15%' },
  { label: '兼职收入', amount: 1800, color: 'bg-rose-300', width: '10%' },
  { label: '其他', amount: 500, color: 'bg-rose-200', width: '5%' },
]

export const totalIncome = 20500
