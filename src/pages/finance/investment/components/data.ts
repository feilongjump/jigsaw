
export interface SummaryMetric {
  title: string;
  value: string;
  trend: number; // percentage
  trendLabel: string;
  icon: string; // Icon name from lucide-react
}

export interface PnLDataPoint {
  date: string;
  floatingPnL: number;
  realizedPnL: number;
}

export interface DailyPnL {
    date: string;
    value: number;
}

export interface TradeRecord {
    id: string;
    date: string;
    type: "buy" | "sell";
    price: number;
    shares: number;
    amount: number;
    commission: number; // 佣金
    stampDuty: number;  // 印花税 (仅卖出时有)
    totalCost: number; // 总费用 (含税费)
}

export interface StockPosition {
  id: string;
  symbol: string;
  name: string;
  logo: string; // URL or placeholder
  price: number;
  avgCost: number;
  shares: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  dailyPnLHistory: DailyPnL[]; 
  tradeHistory: TradeRecord[]; // New field for trade history
}

export const summaryMetrics: SummaryMetric[] = [
  {
    title: "总资产",
    value: "124,592.00",
    trend: 12.5,
    trendLabel: "相比上月",
    icon: "Wallet",
  },
  {
    title: "总盈亏",
    value: "+24,592.00",
    trend: 8.2,
    trendLabel: "历史累计",
    icon: "TrendingUp",
  },
  {
    title: "当日盈亏",
    value: "+1,203.50",
    trend: 1.4,
    trendLabel: "相比昨日",
    icon: "Activity",
  },
];

export const chartData: PnLDataPoint[] = [
  { date: "1月", floatingPnL: 4000, realizedPnL: 2400 },
  { date: "2月", floatingPnL: 3000, realizedPnL: 1398 },
  { date: "3月", floatingPnL: 2000, realizedPnL: 9800 },
  { date: "4月", floatingPnL: 2780, realizedPnL: 3908 },
  { date: "5月", floatingPnL: 1890, realizedPnL: 4800 },
  { date: "6月", floatingPnL: 2390, realizedPnL: 3800 },
  { date: "7月", floatingPnL: 3490, realizedPnL: 4300 },
  { date: "8月", floatingPnL: 4200, realizedPnL: 5100 },
  { date: "9月", floatingPnL: 5600, realizedPnL: 5400 },
  { date: "10月", floatingPnL: 6100, realizedPnL: 6200 },
  { date: "11月", floatingPnL: 5800, realizedPnL: 6800 },
  { date: "12月", floatingPnL: 7200, realizedPnL: 7500 },
];

// Helper to generate random PnL history
const generateHistory = (baseValue: number, days: number = 7): DailyPnL[] => {
    return Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
        // Random fluctuation around baseValue
        const fluctuation = (Math.random() - 0.5) * (Math.abs(baseValue) * 0.2); 
        return {
            date: dateStr,
            value: baseValue + fluctuation
        };
    });
};

// Helper to generate mock trade history
const generateTradeHistory = (symbol: string, currentPrice: number): TradeRecord[] => {
    return [
        {
            id: "t1",
            date: "2023-10-15",
            type: "buy",
            price: currentPrice * 0.9,
            shares: 100,
            amount: currentPrice * 0.9 * 100,
            commission: 5.00,
            stampDuty: 0,
            totalCost: currentPrice * 0.9 * 100 + 5.00
        },
        {
            id: "t2",
            date: "2023-11-20",
            type: "sell",
            price: currentPrice * 1.1,
            shares: 50,
            amount: currentPrice * 1.1 * 50,
            commission: 5.00,
            stampDuty: currentPrice * 1.1 * 50 * 0.001, // 0.1% stamp duty
            totalCost: (currentPrice * 1.1 * 50) - 5.00 - (currentPrice * 1.1 * 50 * 0.001)
        }
    ];
};

export const stockPositions: StockPosition[] = [
  {
    id: "1",
    symbol: "AAPL",
    name: "Apple Inc.",
    logo: "https://logo.clearbit.com/apple.com",
    price: 185.92,
    avgCost: 150.00,
    shares: 50,
    marketValue: 9296.00,
    unrealizedPnL: 1796.00,
    unrealizedPnLPercent: 23.9,
    dailyPnLHistory: generateHistory(1796),
    tradeHistory: generateTradeHistory("AAPL", 185.92),
  },
  {
    id: "2",
    symbol: "TSLA",
    name: "Tesla, Inc.",
    logo: "https://logo.clearbit.com/tesla.com",
    price: 245.50,
    avgCost: 260.00,
    shares: 20,
    marketValue: 4910.00,
    unrealizedPnL: -290.00,
    unrealizedPnLPercent: -5.6,
    dailyPnLHistory: generateHistory(-290),
    tradeHistory: generateTradeHistory("TSLA", 245.50),
  },
  {
    id: "3",
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    logo: "https://logo.clearbit.com/nvidia.com",
    price: 480.00,
    avgCost: 320.00,
    shares: 15,
    marketValue: 7200.00,
    unrealizedPnL: 2400.00,
    unrealizedPnLPercent: 50.0,
    dailyPnLHistory: generateHistory(2400),
    tradeHistory: generateTradeHistory("NVDA", 480.00),
  },
  {
    id: "4",
    symbol: "MSFT",
    name: "Microsoft Corp.",
    logo: "https://logo.clearbit.com/microsoft.com",
    price: 375.00,
    avgCost: 300.00,
    shares: 30,
    marketValue: 11250.00,
    unrealizedPnL: 2250.00,
    unrealizedPnLPercent: 25.0,
    dailyPnLHistory: generateHistory(2250),
    tradeHistory: generateTradeHistory("MSFT", 375.00),
  },
  {
    id: "5",
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    logo: "https://logo.clearbit.com/amazon.com",
    price: 155.00,
    avgCost: 160.00,
    shares: 40,
    marketValue: 6200.00,
    unrealizedPnL: -200.00,
    unrealizedPnLPercent: -3.1,
    dailyPnLHistory: generateHistory(-200),
    tradeHistory: generateTradeHistory("AMZN", 155.00),
  },
];
