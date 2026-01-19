
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Button,
} from "@heroui/react";
import { Eye, Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import type { StockPosition } from "./data";

interface StockTableProps {
  positions: StockPosition[];
}

const columns = [
  { name: "代码", uid: "symbol" },
  { name: "现价", uid: "price" },
  { name: "平均成本", uid: "avgCost" },
  { name: "持仓量", uid: "shares" },
  { name: "市值", uid: "marketValue" },
  { name: "未实现盈亏", uid: "unrealizedPnL" },
  { name: "7日盈亏趋势", uid: "trend" }, // New column
  { name: "操作", uid: "actions" },
];

export function StockTable({ positions }: StockTableProps) {
  const renderCell = (position: StockPosition, columnKey: React.Key) => {
    switch (columnKey) {
      case "symbol":
        return (
          <div className="flex flex-col">
            <span className="text-bold text-sm capitalize text-default-900">{position.symbol}</span>
            <span className="text-tiny text-default-500">{position.name}</span>
          </div>
        );
      case "price":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-default-900">${position.price.toFixed(2)}</p>
          </div>
        );
      case "avgCost":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-default-500">${position.avgCost.toFixed(2)}</p>
          </div>
        );
      case "shares":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-default-900">{position.shares}</p>
          </div>
        );
      case "marketValue":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-default-900">￥{position.marketValue.toFixed(2)}</p>
          </div>
        );
      case "unrealizedPnL":
        const isPositive = position.unrealizedPnL >= 0;
        return (
          <Chip
            className="capitalize"
            color={isPositive ? "danger" : "success"}
            size="sm"
            variant="flat"
            startContent={isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          >
            <span className="ml-1">
                {isPositive ? "+" : ""}
                ￥{Math.abs(position.unrealizedPnL).toFixed(2)} ({position.unrealizedPnLPercent}%)
            </span>
          </Chip>
        );
      case "trend":
        return (
          <div className="h-10 w-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={position.dailyPnLHistory}>
                <defs>
                  <linearGradient id={`colorPnL-${position.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop 
                        offset="5%" 
                        stopColor={position.unrealizedPnL >= 0 ? "#f43f5e" : "#10b981"} 
                        stopOpacity={0.3}
                    />
                    <stop 
                        offset="95%" 
                        stopColor={position.unrealizedPnL >= 0 ? "#f43f5e" : "#10b981"} 
                        stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={position.unrealizedPnL >= 0 ? "#f43f5e" : "#10b981"}
                  fill={`url(#colorPnL-${position.id})`}
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="详情">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Eye size={18} />
              </span>
            </Tooltip>
            <Tooltip content="编辑">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Edit size={18} />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="卖出">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <Trash2 size={18} />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return position[columnKey as keyof StockPosition];
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
             <h3 className="text-xl font-bold text-default-900">持仓列表</h3>
             <Button color="primary" variant="flat" size="sm">添加持仓</Button>
        </div>
        <Table aria-label="Example table with custom cells" removeWrapper>
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={positions}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
