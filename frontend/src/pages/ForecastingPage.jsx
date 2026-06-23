import { useEffect, useMemo, useState } from "react";
import { getForecastRevenue, getRevenueTrend } from "../services/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function formatCurrency(value) {
  const num = Number(value || 0);
  return `₹${num.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function ForecastingPage() {
  const [forecastData, setForecastData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [days, setDays] = useState(7);
  const [historyDays, setHistoryDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchForecastPageData();
  }, [days, historyDays]);

  const fetchForecastPageData = async () => {
    try {
      setLoading(true);
      setError("");

      const [forecastRes, historyRes] = await Promise.all([
        getForecastRevenue(days),
        getRevenueTrend(historyDays),
      ]);

      const forecastArray = Array.isArray(forecastRes?.revenue_forecast)
  ? forecastRes.revenue_forecast
  : Array.isArray(forecastRes?.forecast)
  ? forecastRes.forecast
  : Array.isArray(forecastRes)
  ? forecastRes
  : [];

      const historyArray = Array.isArray(historyRes)
        ? historyRes
        : Array.isArray(historyRes?.data)
        ? historyRes.data
        : [];

      setForecastData(forecastArray);
      setHistoryData(historyArray);
    } catch (err) {
      console.error("Forecast page error:", err);
      setError("Failed to load forecasting data.");
      setForecastData([]);
      setHistoryData([]);
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo(() => {
    const historyMapped = historyData.map((item) => ({
      date: item.date,
      actual_revenue: Number(item.revenue || 0),
      predicted_revenue: null,
    }));

    const forecastMapped = forecastData.map((item) => ({
      date: item.date,
      actual_revenue: null,
      predicted_revenue: Number(item.predicted_revenue || 0),
    }));

    return [...historyMapped, ...forecastMapped];
  }, [historyData, forecastData]);

  const totalForecastRevenue = useMemo(() => {
    return forecastData.reduce(
      (sum, item) => sum + Number(item.predicted_revenue || 0),
      0
    );
  }, [forecastData]);

  const avgForecastRevenue = useMemo(() => {
    if (!forecastData.length) return 0;
    return totalForecastRevenue / forecastData.length;
  }, [forecastData, totalForecastRevenue]);

  const bestForecastDay = useMemo(() => {
    if (!forecastData.length) return null;

    return forecastData.reduce((best, curr) =>
      Number(curr.predicted_revenue || 0) >
      Number(best.predicted_revenue || 0)
        ? curr
        : best
    );
  }, [forecastData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Forecasting</h1>
          <p className="mt-2 text-slate-500">
            Revenue forecast generated from historical order trends
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="card p-3">
            <label className="text-xs font-medium text-slate-500 block mb-1">
              Forecast Days
            </label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none"
            >
              <option value={7}>Next 7 Days</option>
              <option value={14}>Next 14 Days</option>
              <option value={30}>Next 30 Days</option>
            </select>
          </div>

          <div className="card p-3">
            <label className="text-xs font-medium text-slate-500 block mb-1">
              History Window
            </label>
            <select
              value={historyDays}
              onChange={(e) => setHistoryDays(Number(e.target.value))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none"
            >
              <option value={30}>Last 30 Days</option>
              <option value={60}>Last 60 Days</option>
              <option value={90}>Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="card p-5">
          <p className="text-sm text-slate-500">Forecast Horizon</p>
          <h3 className="mt-3 text-2xl font-bold text-slate-900">{days} days</h3>
          <p className="mt-2 text-sm text-slate-500">
            Number of future days predicted
          </p>
        </div>

        <div className="card p-5">
          <p className="text-sm text-slate-500">Projected Revenue</p>
          <h3 className="mt-3 text-2xl font-bold text-slate-900">
            {formatCurrency(totalForecastRevenue)}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Total predicted revenue for selected horizon
          </p>
        </div>

        <div className="card p-5">
          <p className="text-sm text-slate-500">Average Daily Forecast</p>
          <h3 className="mt-3 text-2xl font-bold text-slate-900">
            {formatCurrency(avgForecastRevenue)}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Mean predicted daily revenue
          </p>
        </div>

        <div className="card p-5">
          <p className="text-sm text-slate-500">Best Forecast Day</p>
          <h3 className="mt-3 text-lg font-bold text-slate-900">
            {bestForecastDay ? bestForecastDay.date : "--"}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            {bestForecastDay
              ? formatCurrency(bestForecastDay.predicted_revenue)
              : "No forecast data"}
          </p>
        </div>
      </section>

      {/* Chart */}
      <section className="card p-5">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-900">
            Revenue Forecast Trend
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Historical revenue vs predicted future revenue
          </p>
        </div>

        {loading ? (
          <div className="h-[420px] flex items-center justify-center text-slate-500">
            Loading chart...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[420px] flex items-center justify-center text-slate-400">
            No chart data available
          </div>
        ) : (
          <div className="h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="actual_revenue"
                  name="Historical Revenue"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="predicted_revenue"
                  name="Forecast Revenue"
                  strokeWidth={3}
                  strokeDasharray="6 6"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* Summary + Table */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 card p-5">
          <h3 className="text-lg font-semibold text-slate-900">
            Forecast Summary
          </h3>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">History Used</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                Last {historyDays} days
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Forecast Horizon</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {days} days
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Predicted Total Revenue</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {formatCurrency(totalForecastRevenue)}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Peak Predicted Day</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {bestForecastDay ? bestForecastDay.date : "--"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {bestForecastDay
                  ? formatCurrency(bestForecastDay.predicted_revenue)
                  : "No data"}
              </p>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 card p-5">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Forecast Output Table
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Day-wise predicted revenue values from the model
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  <th className="py-3 pr-4">Date</th>
                  <th className="py-3">Predicted Revenue</th>
                </tr>
              </thead>
              <tbody>
                {forecastData.length === 0 ? (
                  <tr>
                    <td className="py-4 text-slate-400" colSpan={2}>
                      No forecast data available
                    </td>
                  </tr>
                ) : (
                  forecastData.map((item, index) => (
                    <tr
                      key={`${item.date}-${index}`}
                      className="border-b border-slate-50 last:border-b-0"
                    >
                      <td className="py-3 pr-4 text-slate-700">{item.date}</td>
                      <td className="py-3 text-slate-700">
                        {formatCurrency(item.predicted_revenue)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ForecastingPage;