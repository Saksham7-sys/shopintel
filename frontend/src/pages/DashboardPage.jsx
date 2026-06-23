import { useEffect, useMemo, useState } from "react";
import Header from "../components/layout/Header";
import KPICard from "../components/dashboard/KPICard";
import ChartCard from "../components/dashboard/ChartCard";
import TopProductsTable from "../components/dashboard/TopProductsTable";
import TopUsersTable from "../components/dashboard/TopUsersTable";
import CustomerBreakdownCard from "../components/dashboard/CustomerBreakdownCard";
import FunnelCard from "../components/dashboard/FunnelCard";
import ForecastSummaryCard from "../components/dashboard/ForecastSummaryCard";
import { getDashboardOverview } from "../services/analyticsService";
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

const PIE_COLORS = [
  "#4f46e5",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#8b5cf6",
];

function DashboardPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setPageError("");
        const res = await getDashboardOverview(days);
        setData(res);
      } catch (error) {
        console.error(error);
        setPageError(
          error?.response?.data?.detail ||
            error?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [days]);

  const revenueTrend = data?.trends?.revenue ?? [];
  const ordersTrend = data?.trends?.orders ?? [];
  const dauTrend = data?.trends?.dau ?? [];
  const forecastTrend = data?.trends?.forecast ?? [];
  const salesByCategory = data?.salesByCategory ?? [];

  const forecastChartData = useMemo(
    () =>
      forecastTrend.map((item) => ({
        date: item.date,
        predicted_revenue: item.predicted_revenue,
      })),
    [forecastTrend]
  );

  const quickButtons = [7, 30, 90];

  return (
    <div className="px-4 py-6 md:px-8 lg:px-10">
      <Header
        title="Dashboard"
        subtitle="High-level ecommerce performance overview"
        rightContent={
          <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            {quickButtons.map((value) => (
              <button
                key={value}
                onClick={() => setDays(value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  days === value
                    ? "bg-brand-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {value}d
              </button>
            ))}
          </div>
        }
      />

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
        </div>
      ) : (
        <>
          <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            <KPICard
              title="Total Revenue"
              value={formatCurrency(data?.kpis?.totalRevenue)}
              subtitle={`${days}-day revenue`}
            />
            <KPICard
              title="Total Orders"
              value={formatNumber(data?.kpis?.totalOrders)}
              subtitle={`${days}-day orders`}
            />
            <KPICard
              title="Daily Active Users"
              value={formatNumber(data?.kpis?.dailyActiveUsers)}
              subtitle="Distinct active event users"
            />
            <KPICard
              title="Conversion Rate"
              value={formatPercent(data?.kpis?.conversionRate)}
              subtitle="Purchase users / page view users"
            />
            <KPICard
              title="Average Order Value"
              value={formatCurrency(data?.kpis?.averageOrderValue)}
              subtitle="Revenue per order"
            />
            <KPICard
              title="Repeat Customers"
              value={formatNumber(data?.kpis?.repeatCustomers)}
              subtitle="Customers with more than one order"
            />
          </section>

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
                  <Tooltip formatter={(value) => formatCurrency(value)} />
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
              title="Revenue Forecast Snapshot"
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

          <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-1">
              <ChartCard
                title="Sales by Category"
                subtitle="Revenue distribution across categories"
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
                breakdown={data?.customerBreakdown}
                repeatRate={data?.customerRepeatRate}
              />
            </div>

            <div className="xl:col-span-1">
              <FunnelCard funnel={data?.funnel} />
            </div>
          </section>

          <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <TopProductsTable data={data?.topProducts} />
            <TopUsersTable data={data?.topUsers} />
          </section>

          <section className="mt-8">
            <ForecastSummaryCard summary={data?.forecastSummary} />
          </section>
        </>
      )}
    </div>
  );
}

export default DashboardPage;