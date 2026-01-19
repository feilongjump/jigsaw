
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { TrendingUp, TrendingDown } from "lucide-react";
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
              <div className="h-[250px] w-full border border-default-100 rounded-xl p-2 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
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
              <Table aria-label="Trade history table" removeWrapper>
                <TableHeader>
                  <TableColumn>日期</TableColumn>
                  <TableColumn>类型</TableColumn>
                  <TableColumn>价格</TableColumn>
                  <TableColumn>数量</TableColumn>
                  <TableColumn>佣金</TableColumn>
                  <TableColumn>印花税</TableColumn>
                  <TableColumn>总金额</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"暂无交易记录"}>
                  {position.tradeHistory.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>{trade.date}</TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={trade.type === "buy" ? "success" : "danger"}
                        >
                          {trade.type === "buy" ? "买入" : "卖出"}
                        </Chip>
                      </TableCell>
                      <TableCell>{trade.price.toFixed(2)}</TableCell>
                      <TableCell>{trade.shares}</TableCell>
                      <TableCell>{trade.commission.toFixed(2)}</TableCell>
                      <TableCell>{trade.stampDuty.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold">{trade.totalCost.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                关闭
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
