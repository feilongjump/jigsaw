
import { createFileRoute } from '@tanstack/react-router'
import { SummaryCards } from './components/SummaryCards'
import { PnLChart } from './components/PnLChart'
import { StockGrid } from './components/StockGrid'
import { summaryMetrics, chartData, stockPositions } from './components/data'

export const Route = createFileRoute('/finance/investment/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-default-900 tracking-tight">投资概览</h1>
        <p className="text-default-500 mt-1">追踪您的资产、盈亏及投资组合表现。</p>
      </header>

      {/* Summary Cards */}
      <SummaryCards metrics={summaryMetrics} />

      {/* Main Chart */}
      <PnLChart data={chartData} />

      {/* Stock Grid */}
      <StockGrid positions={stockPositions} />
    </div>
  )
}
