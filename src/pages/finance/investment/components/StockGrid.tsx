
import { Card, CardBody, CardHeader, CardFooter, Button, Chip, Divider, useDisclosure } from "@heroui/react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { useState } from "react";
import type { StockPosition } from "./data";
import { AddPositionModal } from "./modals/AddPositionModal";
import { TradeModal } from "./modals/TradeModal";
import { PositionDetailsModal } from "./modals/PositionDetailsModal";

interface StockGridProps {
  positions: StockPosition[];
}

export function StockGrid({ positions }: StockGridProps) {
  const addModal = useDisclosure();
  const tradeModal = useDisclosure();
  const detailsModal = useDisclosure();
  
  const [selectedPosition, setSelectedPosition] = useState<StockPosition | null>(null);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");

  const handleTrade = (position: StockPosition, type: "buy" | "sell") => {
      setSelectedPosition(position);
      setTradeType(type);
      tradeModal.onOpen();
  };

  const handleDetails = (position: StockPosition) => {
      setSelectedPosition(position);
      detailsModal.onOpen();
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-default-900">持仓列表</h3>
        <Button color="primary" variant="flat" size="sm" onPress={addModal.onOpen}>添加持仓</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {positions.map((position) => {
          const isPositive = position.unrealizedPnL >= 0;
          const color = isPositive ? "#f43f5e" : "#10b981"; // rose-500 : emerald-500
          
          return (
            <Card key={position.id} className="border-none shadow-sm bg-white dark:bg-zinc-900">
              <CardHeader className="flex justify-between items-start px-6 pt-6 pb-0">
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-default-900">{position.symbol}</span>
                  <span className="text-sm text-default-500">{position.name}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-lg font-bold text-default-900">{position.price.toFixed(2)}</span>
                  <Chip
                    className="mt-1"
                    size="sm"
                    variant="flat"
                    color={isPositive ? "danger" : "success"}
                    startContent={isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  >
                    {isPositive ? "+" : ""}
                    {position.unrealizedPnLPercent}%
                  </Chip>
                </div>
              </CardHeader>
              
              <CardBody className="px-0 py-4 overflow-hidden">
                {/* 趋势图区域 */}
                <div className="h-24 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={position.dailyPnLHistory}>
                      <defs>
                        <linearGradient id={`gradient-${position.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={color} stopOpacity={0.15}/>
                          <stop offset="95%" stopColor={color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2}
                        fill={`url(#gradient-${position.id})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                {/* 核心指标区域 */}
                <div className="grid grid-cols-2 gap-4 px-6 mt-2">
                   <div className="flex flex-col gap-1">
                      <span className="text-tiny text-default-400 uppercase">持仓市值</span>
                      <span className="text-base font-semibold text-default-900">{position.marketValue.toLocaleString()}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-tiny text-default-400 uppercase">浮动盈亏</span>
                      <span className={`text-base font-semibold ${isPositive ? "text-danger" : "text-success"}`}>
                         {isPositive ? "+" : ""}{Math.abs(position.unrealizedPnL).toLocaleString()}
                      </span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-tiny text-default-400 uppercase">持仓数量</span>
                      <span className="text-sm font-medium text-default-700">{position.shares} 股</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-tiny text-default-400 uppercase">平均成本</span>
                      <span className="text-sm font-medium text-default-700">{position.avgCost.toFixed(2)}</span>
                   </div>
                </div>
              </CardBody>
              
              <Divider className="opacity-50"/>
              
              <CardFooter className="px-6 py-3 flex justify-between items-center bg-default-50 dark:bg-default-100/50">
                 <Button 
                    size="sm" 
                    variant="light" 
                    className="text-default-500"
                    onPress={() => handleDetails(position)}
                 >
                    详情
                 </Button>
                 <div className="flex gap-2">
                    <Button 
                        size="sm" 
                        variant="flat" 
                        color="success" 
                        className="bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400"
                        onPress={() => handleTrade(position, "buy")}
                    >
                       补仓
                    </Button>
                    <Button 
                        size="sm" 
                        variant="flat" 
                        color="danger"
                        className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                        onPress={() => handleTrade(position, "sell")}
                    >
                       卖出
                    </Button>
                 </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <AddPositionModal isOpen={addModal.isOpen} onOpenChange={addModal.onOpenChange} />
      <TradeModal 
        isOpen={tradeModal.isOpen} 
        onOpenChange={tradeModal.onOpenChange} 
        type={tradeType} 
        position={selectedPosition} 
      />
      <PositionDetailsModal 
        isOpen={detailsModal.isOpen} 
        onOpenChange={detailsModal.onOpenChange} 
        position={selectedPosition} 
      />
    </div>
  );
}
