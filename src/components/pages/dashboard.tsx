import {
  KpiStrip,
  MainChart,
  PortfolioGrowthCard,
  PnlCard,
  VolumeCard,
  AllocationCard,
  RiskCard,
  WinRateCard,
  MonthlyRoiCard,
  WeeklyPerfCard,
  DailyCalendarCard,
} from "@/components/dashboard/analytics"
import { ApiCenter } from "@/components/dashboard/api-center"
import {
  MarketHeatmap,
  OpenPositions,
  RecentTrades,
  OrderHistory,
  Watchlist,
  MoversList,
  TransactionsPanel,
  BotPanel,
} from "@/components/dashboard/widgets"

export default function DashboardPage() {
  return (
    <div className="space-y-4 p-3 lg:p-5">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground lg:text-xl">Dashboard</h1>
          <p className="text-[12px] text-muted-foreground">Live overview of markets, portfolio and execution</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-gain/25 bg-gain/[0.06] px-2.5 py-1 text-[11px] text-gain">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gain" /> Markets Open · Real-time
        </div>
      </div>

      <KpiStrip />

      {/* Main chart + API center */}
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <MainChart />
          <div className="grid gap-4 md:grid-cols-2">
            <PortfolioGrowthCard />
            <PnlCard />
          </div>
        </div>
        <ApiCenter />
      </div>

      {/* Analytics row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AllocationCard />
        <RiskCard />
        <WinRateCard />
        <VolumeCard />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <MonthlyRoiCard />
        <WeeklyPerfCard />
        <DailyCalendarCard />
      </div>

      <MarketHeatmap />

      {/* Trading data */}
      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <OpenPositions />
        <RecentTrades />
      </div>

      <OrderHistory />

      {/* Watchlist + movers */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Watchlist />
        <MoversList mode="gainers" />
        <MoversList mode="losers" />
      </div>

      {/* Wallet flows + bot */}
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <TransactionsPanel />
        <BotPanel />
      </div>
    </div>
  )
}
