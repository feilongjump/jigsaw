import { motion } from 'framer-motion'
import { clsx } from 'clsx'

export interface StatCardProps {
  title: string
  label: string
  icon: any
  data: { current: number; lastMonth: number; percentage: number }
  theme: 'emerald' | 'rose'
  delay: number
}

export function StatCard({ title, label, icon: Icon, data, theme, delay }: StatCardProps) {
  const isEmerald = theme === 'emerald'
  const colorText = isEmerald ? 'text-emerald-600' : 'text-rose-600'
  const colorTextDark = isEmerald ? 'text-emerald-700' : 'text-rose-700'
  const bgLight = isEmerald ? 'bg-emerald-50' : 'bg-rose-50'
  const bgBase = isEmerald ? 'bg-emerald-500' : 'bg-rose-500'
  const bgDark = isEmerald ? 'bg-emerald-700' : 'bg-rose-700'

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-100 flex flex-col justify-between h-40"
    >
      <div className="flex items-center gap-2 text-zinc-500 mb-2">
        <div className={`p-1.5 rounded-full ${bgLight} ${colorText}`}>
          <Icon size={14} />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider">{title}</span>
      </div>
      
      <div className="flex-1 flex flex-col justify-end">
         <div className="flex items-end justify-between mb-2">
            <span className={`text-2xl font-bold ${colorText}`}>¥{data.current.toLocaleString()}</span>
            <span className={clsx(
                "text-xs mb-1 font-bold",
                data.percentage > 100 ? colorTextDark : "text-zinc-400"
            )}>
                {data.percentage}%
            </span>
         </div>
         
         <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden relative">
            <div 
                className={`h-full rounded-full absolute left-0 top-0 ${bgBase}`}
                style={{ width: `${Math.min(data.percentage, 100)}%` }} 
            />
            {data.percentage > 100 && (
                <div 
                    className={`h-full rounded-full absolute left-0 top-0 animate-pulse ${bgDark}`}
                    style={{ width: `${Math.min(data.percentage - 100, 100)}%` }} 
                />
            )}
         </div>
         <div className="mt-2 text-xs text-zinc-500 font-medium flex justify-between">
            <span>{label}</span>
            <span className="font-bold">¥{data.lastMonth.toLocaleString()}</span>
         </div>
      </div>
    </motion.div>
  )
}
