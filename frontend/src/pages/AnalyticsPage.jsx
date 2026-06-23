import { useEffect, useMemo, useState } from "react";
import Header from "../components/layout/Header";
import FilterBar from "../components/common/FilterBar";
import StatBox from "../components/common/StatBox";
import ChartCard from "../components/dashboard/ChartCard";
import TopUsersTable from "../components/dashboard/TopUsersTable";
import TopProductsTable from "../components/dashboard/TopProductsTable";
import CustomerBreakdownCard from "../components/dashboard/CustomerBreakdownCard";
import FunnelCard from "../components/dashboard/FunnelCard";
import { getAnalyticsPageData } from "../services/analyticsService";
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
} from "recharts";

function AnalyticsPage() {
  const [filters, setFilters] = useState({
    days: 30,
    start_date: "",
    end_date: "",
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setPageError("");
        const res = await getAnalyticsPageData(filters);
        setData(res);
      } catch (error) {
        console.error(error);
        setPageError(
          error?.response?.data?.detail ||
            error?.message ||
            "Failed to load analytics"
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [filters]);

  const categoryTrendData = useMemo(() => {
    const raw = data?.categoryRevenueTrend ?? [];
    return raw.map((item, index) => ({
      label:
        item.category ||
        item.name ||
        item.date ||
        item.day ||
        `Point ${index + 1}`,
      revenue:
        item.revenue ??
        item.total_revenue ??
        item.amount ??
        item.value ??
        0,
    }));
  }, [data]);

  return (
    <div className="px-4 py-6 md:px-8 lg:px-10">
      <Header
        title="Analytics"
        subtitle="Deeper filtered analysis across revenue, users, funnel and categories"
      />

      <div className="mt-6">
        <FilterBar filters={filters} onApply={setFilters} />
      </div>

      {loading ? (
        <div className="mt-8 card p-8 text-center">
          <p className="text-slate-500">Loading analytics...</p>
        </div>
      ) : pageError ? (
        <div className="mt-8 card p-8">
          <h3 className="text-lg font-semibold text-red-600">
            Failed to load analytics
          </h3>
          <p className="mt-2 text-sm text-slate-600">{pageError}</p>
        </div>
      ) : (
        <>
          <section className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatBox
              label="Filtered Revenue"
              value={formatCurrency(data?.totals?.revenue)}
            />
            <StatBox
              label="Filtered Orders"
              value={formatNumber(data?.totals?.orders)}
            />
            <StatBox
              label="Total Customers"
              value={formatNumber(data?.customerBreakdown?.total_customers)}
            />
            <StatBox
              label="Repeat Rate"
              value={formatPercent(data?.customerRepeatRate?.repeat_rate)}
            />
          </section>

          <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <ChartCard
              title="Revenue Trend"
              subtitle="Filtered revenue trend"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.revenueTrend ?? []}>
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
              subtitle="Filtered order volume trend"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.ordersTrend ?? []}>
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
              subtitle="Filtered daily active user trend"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.dauTrend ?? []}>
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
              title="Category Revenue Trend"
              subtitle="Category-level revenue analytics"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis tickFormatter={shortCurrency} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="revenue" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </section>

          <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-1">
              <CustomerBreakdownCard
                breakdown={data?.customerBreakdown}
                repeatRate={data?.customerRepeatRate}
              />
            </div>

            <div className="xl:col-span-2">
              <FunnelCard funnel={data?.funnel} />
            </div>
          </section>

          <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <TopUsersTable data={data?.topUsers} />
            <TopProductsTable data={data?.topProducts} />
          </section>
        </>
      )}
    </div>
  );
}

export default AnalyticsPage;