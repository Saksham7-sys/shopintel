import api from "./api";
import { buildFilterParams } from "../utils/formatters";

export async function getDashboardOverview(days = 30) {
  const filters = { days };

  const [
    revenueRes,
    ordersRes,
    dauRes,
    conversionRes,
    aovRes,
    repeatCustomersRes,
    revenueTrendRes,
    ordersTrendRes,
    dauTrendRes,
    topProductsRes,
    salesByCategoryRes,
    topUsersRes,
    customerBreakdownRes,
    customerRepeatRateRes,
    funnelRes,
    forecastRes,
    forecastSummaryRes,
  ] = await Promise.all([
    api.get("/analytics/revenue", { params: buildFilterParams(filters) }),
    api.get("/analytics/orders", { params: buildFilterParams(filters) }),
    api.get("/analytics/dau"),
    api.get("/analytics/conversion"),
    api.get("/analytics/aov"),
    api.get("/analytics/repeat-customers"),
    api.get("/analytics/revenue-trend", { params: buildFilterParams(filters) }),
    api.get("/analytics/orders-trend", { params: buildFilterParams(filters) }),
    api.get("/analytics/dau-trend", { params: buildFilterParams(filters) }),
    api.get("/analytics/top-products"),
    api.get("/analytics/sales-by-category"),
    api.get("/analytics/top-users", {
      params: { ...buildFilterParams(filters), limit: 10 },
    }),
    api.get("/analytics/customer-breakdown", {
      params: buildFilterParams(filters),
    }),
    api.get("/analytics/customer-repeat-rate", {
      params: buildFilterParams(filters),
    }),
    api.get("/analytics/funnel"),
    api.get("/analytics/revenue-forecast", { params: { days: 7 } }),
    api.get("/analytics/revenue-forecast-summary", { params: { days: 7 } }),
  ]);

  return {
    kpis: {
      totalRevenue: revenueRes.data?.total_revenue ?? 0,
      totalOrders: ordersRes.data?.total_orders ?? 0,
      dailyActiveUsers: dauRes.data?.daily_active_users ?? 0,
      conversionRate: conversionRes.data?.conversion_rate ?? 0,
      averageOrderValue: aovRes.data?.average_order_value ?? 0,
      repeatCustomers: repeatCustomersRes.data?.repeat_customers ?? 0,
    },
    trends: {
      revenue: revenueTrendRes.data?.revenue_trend ?? [],
      orders: ordersTrendRes.data?.orders_trend ?? [],
      dau: dauTrendRes.data?.dau_trend ?? [],
      forecast: forecastRes.data?.revenue_forecast ?? [],
    },
    topProducts: topProductsRes.data?.top_products ?? [],
    salesByCategory: salesByCategoryRes.data?.sales_by_category ?? [],
    topUsers: topUsersRes.data?.top_users ?? [],
    customerBreakdown: customerBreakdownRes.data?.customer_breakdown ?? {
      total_customers: 0,
      new_customers: 0,
      returning_customers: 0,
    },
    customerRepeatRate: customerRepeatRateRes.data?.customer_repeat_rate ?? {
      total_customers: 0,
      returning_customers: 0,
      repeat_rate: 0,
    },
    funnel: funnelRes.data?.funnel ?? {
      page_view_users: 0,
      product_view_users: 0,
      add_to_cart_users: 0,
      purchase_users: 0,
    },
    forecastSummary:
      forecastSummaryRes.data?.revenue_forecast_summary ?? {
        forecast_days: 7,
        total_predicted_revenue: 0,
        average_predicted_revenue: 0,
        max_predicted_revenue: 0,
        min_predicted_revenue: 0,
      },
  };
}

export async function getAnalyticsPageData(filters) {
  const params = buildFilterParams(filters);

  const [
    revenueRes,
    ordersRes,
    revenueTrendRes,
    ordersTrendRes,
    dauTrendRes,
    topUsersRes,
    customerBreakdownRes,
    customerRepeatRateRes,
    funnelRes,
    categoryRevenueTrendRes,
    topProductsRes,
  ] = await Promise.all([
    api.get("/analytics/revenue", { params }),
    api.get("/analytics/orders", { params }),
    api.get("/analytics/revenue-trend", { params }),
    api.get("/analytics/orders-trend", { params }),
    api.get("/analytics/dau-trend", { params }),
    api.get("/analytics/top-users", {
      params: { ...params, limit: 10 },
    }),
    api.get("/analytics/customer-breakdown", { params }),
    api.get("/analytics/customer-repeat-rate", { params }),
    api.get("/analytics/funnel"),
    api.get("/analytics/category-revenue-trend", {
      params: {
        days:
          params.days && params.days !== ""
            ? Number(params.days)
            : 30,
      },
    }),
    api.get("/analytics/top-products"),
  ]);

  return {
    totals: {
      revenue: revenueRes.data?.total_revenue ?? 0,
      orders: ordersRes.data?.total_orders ?? 0,
    },
    revenueTrend: revenueTrendRes.data?.revenue_trend ?? [],
    ordersTrend: ordersTrendRes.data?.orders_trend ?? [],
    dauTrend: dauTrendRes.data?.dau_trend ?? [],
    topUsers: topUsersRes.data?.top_users ?? [],
    customerBreakdown: customerBreakdownRes.data?.customer_breakdown ?? {
      total_customers: 0,
      new_customers: 0,
      returning_customers: 0,
    },
    customerRepeatRate: customerRepeatRateRes.data?.customer_repeat_rate ?? {
      total_customers: 0,
      returning_customers: 0,
      repeat_rate: 0,
    },
    funnel: funnelRes.data?.funnel ?? {
      page_view_users: 0,
      product_view_users: 0,
      add_to_cart_users: 0,
      purchase_users: 0,
    },
    categoryRevenueTrend:
      categoryRevenueTrendRes.data?.category_revenue_trend ?? [],
    topProducts: topProductsRes.data?.top_products ?? [],
  };
}

export async function getForecastingPageData(days = 7) {
  const [forecastRes, summaryRes] = await Promise.all([
    api.get("/analytics/revenue-forecast", { params: { days } }),
    api.get("/analytics/revenue-forecast-summary", { params: { days } }),
  ]);

  return {
    forecastDays: forecastRes.data?.forecast_days ?? days,
    revenueForecast: forecastRes.data?.revenue_forecast ?? [],
    summary: summaryRes.data?.revenue_forecast_summary ?? {
      forecast_days: days,
      total_predicted_revenue: 0,
      average_predicted_revenue: 0,
      max_predicted_revenue: 0,
      min_predicted_revenue: 0,
    },
  };
}