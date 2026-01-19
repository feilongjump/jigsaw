
import { Card, CardBody } from "@heroui/react";
import { Wallet, TrendingUp, Activity } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SummaryMetric } from "./data";

const iconMap: Record<string, LucideIcon> = {
  Wallet,
  TrendingUp,
  Activity,
};

interface SummaryCardsProps {
  metrics: SummaryMetric[];
}

export function SummaryCards({ metrics }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {metrics.map((metric, index) => {
        const Icon = iconMap[metric.icon] || Wallet;
        const isPositive = metric.trend >= 0;

        return (
          <Card key={index} className="border-none shadow-none bg-transparent">
            <CardBody className="flex flex-row items-center justify-between p-6">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-default-500">{metric.title}</span>
                <span className="text-2xl font-bold text-default-900">{metric.value}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isPositive
                        ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
                        : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {metric.trend}%
                  </span>
                  <span className="text-xs text-default-400">{metric.trendLabel}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-default-100 dark:bg-default-50 text-default-500">
                <Icon size={24} />
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
