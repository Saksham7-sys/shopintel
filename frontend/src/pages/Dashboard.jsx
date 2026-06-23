import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import KPICard from "../components/dashboard/KPICard";
import ChartCard from "../components/dashboard/ChartCard";
import TopProductsTable from "../components/dashboard/TopProductsTable";
import TopUsersTable from "../components/dashboard/TopUsersTable";
import CustomerBreakdownCard from "../components/dashboard/CustomerBreakdownCard";
import FunnelCard from "../components/dashboard/FunnelCard";
import ForecastSummaryCard from "../components/dashboard/ForecastSummaryCard";
import { getDashboardData } from "../services/analyticsService";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  shortCurrency,
} from "../utils/formatters";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const PIE_COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6"];

function Dashboard() {
  const [days, setDays] = useState(30);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setPageError("");
        const data = await getDashboardData(days);
        setDashboardData(data);
      } catch (error) {
        console.error("Dashboard load failed:", error);
        setPageError(
          error?.response?.data?.detail ||
            error?.message ||
            "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [days]);

  const revenueTrend = dashboardData?.trends?.revenue ?? [];
  const ordersTrend = dashboardData?.trends?.orders ?? [];
  const dauTrend = dashboardData?.trends?.dau ?? [];
  const forecastTrend = dashboardData?.trends?.forecast ?? [];
  const salesByCategory = dashboardData?.salesByCategory ?? [];

  const forecastChartData = useMemo(
    () =>
      forecastTrend.map((item) => ({
        date: item.date,
        predicted_revenue: item.predicted_revenue,
      })),
    [forecastTrend]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="lg:pl-64">
        <div className="px-4 py-6 md:px-8 lg:px-10">
          <Header days={days} setDays={setDays} />

          {loading ? (
            <div className="mt-8 card p-8 text-center">
              <p className="text-slate-500">Loading dashboard...</p>
            </div>
          ) : pageError ? (
            <div className="mt-8 card p-8">
              <h3 className="text-lg font-semibold text-red-600">
                Failed to load dashboard
              </h3>
              <p className="mt-2 text-sm text-slate-600">{pageError}</p>
              <p className="mt-3 text-sm text-slate-500">
                Most common reason: backend not running or CORS not enabled.
              </p>
            </div>
          ) : (
            <>
              {/* KPI ROW */}
              <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
                <KPICard
                  title="Total Revenue"
                  value={formatCurrency(dashboardData?.kpis?.totalRevenue)}
                  subtitle={`${days}-day revenue`}
                />
                <KPICard
                  title="Total Orders"
                  value={formatNumber(dashboardData?.kpis?.totalOrders)}
                  subtitle={`${days}-day orders`}
                />
                <KPICard
                  title="Daily Active Users"
                  value={formatNumber(dashboardData?.kpis?.dailyActiveUsers)}
                  subtitle="Distinct active event users"
                />
                <KPICard
                  title="Conversion Rate"
                  value={formatPercent(dashboardData?.kpis?.conversionRate)}
                  subtitle="Purchase users / page view users"
                />
                <KPICard
                  title="Average Order Value"
                  value={formatCurrency(dashboardData?.kpis?.averageOrderValue)}
                  subtitle="Revenue per order"
                />
                <KPICard
                  title="Repeat Customers"
                  value={formatNumber(dashboardData?.kpis?.repeatCustomers)}
                  subtitle="Customers with more than one order"
                />
              </section>

              {/* MAIN CHARTS */}
              <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
                <ChartCard
                  title="Revenue Trend"
                  subtitle={`Revenue over the last ${days} days`}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={shortCurrency} />
                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#4f46e5"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Orders Trend"
                  subtitle={`Order volume over the last ${days} days`}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ordersTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#10b981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="DAU Trend"
                  subtitle={`Daily active users over the last ${days} days`}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dauTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="dau"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Revenue Forecast"
                  subtitle="Predicted revenue for the next 7 days"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forecastChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={shortCurrency} />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Line
                        type="monotone"
                        dataKey="predicted_revenue"
                        stroke="#ef4444"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              </section>

              {/* CATEGORY + CUSTOMER/FUNNEL */}
              <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-1">
                  <ChartCard
                    title="Sales by Category"
                    subtitle="Revenue distribution across product categories"
                    height={320}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={salesByCategory}
                          dataKey="revenue"
                          nameKey="category"
                          cx="50%"
                          cy="50%"
                          outerRadius={95}
                          label
                        >
                          {salesByCategory.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={PIE_COLORS[index % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>

                <div className="xl:col-span-1">
                  <CustomerBreakdownCard
                    breakdown={dashboardData?.customerBreakdown}
                    repeatRate={dashboardData?.customerRepeatRate}
                  />
                </div>

                <div className="xl:col-span-1">
                  <FunnelCard funnel={dashboardData?.funnel} />
                </div>
              </section>

              {/* TABLES */}
              <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
                <TopProductsTable data={dashboardData?.topProducts} />
                <TopUsersTable data={dashboardData?.topUsers} />
              </section>

              {/* FORECAST SUMMARY */}
              <section className="mt-8">
                <ForecastSummaryCard summary={dashboardData?.forecastSummary} />
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;