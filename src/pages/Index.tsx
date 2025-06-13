
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { TopNav } from "@/components/TopNav"
import { MetricCard } from "@/components/MetricCard"
import { RevenueChart, UserGrowthChart, TrafficSourceChart } from "@/components/DashboardChart"
import { RecentActivity } from "@/components/RecentActivity"
import { 
  Users, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp,
  Activity,
  CreditCard
} from "lucide-react"

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                  <p className="text-muted-foreground mt-1">
                    Welcome back! Here's what's happening with your business today.
                  </p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="Total Revenue"
                  value="$45,231.89"
                  change="+20.1% from last month"
                  changeType="positive"
                  icon={DollarSign}
                  description="Total earnings this month"
                />
                <MetricCard
                  title="Active Users"
                  value="2,350"
                  change="+15.3% from last month"
                  changeType="positive"
                  icon={Users}
                  description="Users active in the last 30 days"
                />
                <MetricCard
                  title="Sales"
                  value="12,234"
                  change="+8.2% from last month"
                  changeType="positive"
                  icon={ShoppingCart}
                  description="Total sales this period"
                />
                <MetricCard
                  title="Conversion Rate"
                  value="3.24%"
                  change="-2.1% from last month"
                  changeType="negative"
                  icon={TrendingUp}
                  description="Visitor to customer conversion"
                />
              </div>

              {/* Charts Grid */}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                <RevenueChart />
                <TrafficSourceChart />
              </div>

              <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
                <UserGrowthChart />
                <RecentActivity />
              </div>

              {/* Additional Metrics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <MetricCard
                  title="Server Uptime"
                  value="99.9%"
                  change="All systems operational"
                  changeType="positive"
                  icon={Activity}
                  description="Last 30 days average"
                />
                <MetricCard
                  title="Payment Processing"
                  value="$12,456"
                  change="24 transactions today"
                  changeType="neutral"
                  icon={CreditCard}
                  description="Processed in the last 24h"
                />
                <MetricCard
                  title="Growth Rate"
                  value="12.5%"
                  change="+4.2% from last quarter"
                  changeType="positive"
                  icon={TrendingUp}
                  description="Monthly recurring revenue growth"
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default Index
