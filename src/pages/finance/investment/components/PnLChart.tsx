
import { Card, CardBody, CardHeader, Select, SelectItem } from "@heroui/react";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { PnLDataPoint } from "./data";

interface PnLChartProps {
  data: PnLDataPoint[];
}

export function PnLChart({ data }: PnLChartProps) {
  return (
    <Card className="mb-6 border-none shadow-sm bg-white dark:bg-zinc-900">
      <CardHeader className="flex flex-row justify-between items-center px-6 py-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-default-900">盈亏趋势</h3>
          <p className="text-sm text-default-500">浮动盈亏与已实现盈亏的历史对比</p>
        </div>
        <div className="w-32">
          <Select 
            defaultSelectedKeys={["1y"]} 
            size="sm" 
            aria-label="选择时间范围"
            classNames={{
              trigger: "bg-default-100 dark:bg-default-50",
            }}
          >
            <SelectItem key="1m">1个月</SelectItem>
            <SelectItem key="3m">3个月</SelectItem>
            <SelectItem key="6m">6个月</SelectItem>
            <SelectItem key="1y">1年</SelectItem>
            <SelectItem key="ytd">年初至今</SelectItem>
          </Select>
        </div>
      </CardHeader>
      <CardBody className="pb-4 px-0">
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{
                top: 20,
                right: 10,
                left: 0,
                bottom: 10,
              }}
            >
              <defs>
                <linearGradient id="colorFloating" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                dy={10}
                interval={0} // 强制显示所有标签，或者可以设置为 'preserveStartEnd'
                padding={{ left: 5, right: 15 }} // 在 X 轴两端增加内边距
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickFormatter={(value) => `${value}`}
                width={50} // 限制 Y 轴宽度
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                itemStyle={{ fontSize: "12px", fontWeight: 500 }}
                labelStyle={{ color: "#6b7280", marginBottom: "4px" }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="circle"
              />
              <Area
                type="monotone"
                dataKey="realizedPnL"
                name="已实现盈亏"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorFloating)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="floatingPnL"
                name="浮动盈亏"
                stroke="#94a3b8"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}
