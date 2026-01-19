
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Chip,
} from "@heroui/react";
import { TrendingUp, TrendingDown, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip, XAxis, CartesianGrid } from "recharts";
import type { StockPosition } from "../data";

interface PositionDetailsModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  position: StockPosition | null;
}

export function PositionDetailsModal({ isOpen, onOpenChange, position }: PositionDetailsModalProps) {
  if (!position) return null;

  const isPositive = position.unrealizedPnL >= 0;
  const color = isPositive ? "#f43f5e" : "#10b981";

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 pb-0">
              <div className="flex justify-between items-center pr-6">
                 <div className="flex gap-3 items-center">
                    <span className="text-2xl font-bold">{position.symbol}</span>
                    <span className="text-lg text-default-500">{position.name}</span>
                 </div>
                 <Chip
                    size="md"
                    variant="flat"
                    color={isPositive ? "danger" : "success"}
                    startContent={isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  >
                    {isPositive ? "+" : ""}
                    {position.unrealizedPnLPercent}%
                  </Chip>
              </div>
            </ModalHeader>
            <ModalBody className="py-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                   <div className="flex flex-col gap-1 p-3 bg-default-50 rounded-xl">
                      <span className="text-xs text-default-400 uppercase">现价</span>
                      <span className="text-xl font-bold text-default-900">¥{position.price.toFixed(2)}</span>
                   </div>
                   <div className="flex flex-col gap-1 p-3 bg-default-50 rounded-xl">
                      <span className="text-xs text-default-400 uppercase">浮动盈亏</span>
                      <span className={`text-xl font-bold ${isPositive ? "text-danger" : "text-success"}`}>
                         {isPositive ? "+" : ""}¥{Math.abs(position.unrealizedPnL).toLocaleString()}
                      </span>
                   </div>
                   <div className="flex flex-col gap-1 p-3 bg-default-50 rounded-xl">
                      <span className="text-xs text-default-400 uppercase">持仓市值</span>
                      <span className="text-xl font-bold text-default-900">{position.marketValue.toLocaleString()}</span>
                   </div>
                   <div className="flex flex-col gap-1 p-3 bg-default-50 rounded-xl">
                      <span className="text-xs text-default-400 uppercase">持仓 / 成本</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-default-900">{position.shares} 股</span>
                        <span className="text-xs text-default-500">@ ¥{position.avgCost.toFixed(2)}</span>
                      </div>
                   </div>
              </div>

              <h4 className="text-sm font-semibold text-default-600 mb-2">7日盈亏走势</h4>
              <div className="h-[250px] w-full min-h-[250px] border border-default-100 rounded-xl p-2 mb-6 relative">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart data={position.dailyPnLHistory}>
                      <defs>
                        <linearGradient id={`gradient-detail-${position.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
                          <stop offset="95%" stopColor={color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        width={40}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2}
                        fill={`url(#gradient-detail-${position.id})`}
                        name="浮动盈亏"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
              </div>

              <h4 className="text-sm font-semibold text-default-600 mb-2">交易记录</h4>
              <div className="flex flex-col gap-3 pr-1">
                {position.tradeHistory.length > 0 ? (
                  position.tradeHistory.map((trade) => (
                    <div 
                      key={trade.id} 
                      className="group flex flex-col gap-2 p-3 rounded-xl border border-default-200 bg-content1 hover:border-default-400 transition-all shadow-sm"
                    >
                      {/* Header: Type, Date, Amount */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                           <div className={`p-1.5 rounded-lg ${trade.type === 'buy' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                              {trade.type === 'buy' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                           </div>
                           <div className="flex flex-col">
                              <span className="text-sm font-semibold text-default-900">
                                {trade.type === 'buy' ? '买入' : '卖出'}
                              </span>
                              <span className="text-[10px] text-default-400">{trade.date}</span>
                           </div>
                        </div>
                        <div className="flex flex-col items-end">
                           <span className={`text-medium font-bold ${trade.type === 'buy' ? 'text-default-900' : 'text-danger'}`}>
                              {trade.type === 'buy' ? '-' : '+'}{trade.totalCost.toLocaleString(undefined, {minimumFractionDigits: 2})}
                           </span>
                           <span className="text-[10px] text-default-400">
                              {trade.shares} 股 @ {trade.price.toFixed(2)}
                           </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-3 gap-2 px-2 py-1.5 bg-default-50 rounded-lg mt-1">
                          <div className="flex flex-col">
                             <span className="text-[10px] text-default-400">成交金额</span>
                             <span className="text-xs font-medium text-default-700">{trade.amount.toFixed(2)}</span>
                          </div>
                          <div className="flex flex-col border-l border-default-200 pl-2">
                             <span className="text-[10px] text-default-400">佣金</span>
                             <span className="text-xs font-medium text-default-700">{trade.commission.toFixed(2)}</span>
                          </div>
                          <div className="flex flex-col border-l border-default-200 pl-2">
                             <span className="text-[10px] text-default-400">印花税</span>
                             <span className="text-xs font-medium text-default-700">{trade.stampDuty > 0 ? trade.stampDuty.toFixed(2) : '-'}</span>
                          </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-default-400 text-sm">
                    暂无交易记录
                  </div>
                )}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
