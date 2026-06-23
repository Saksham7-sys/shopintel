import api from "./api";

export async function getDashboardData(days = 30) {
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
    api.get("/analytics/revenue", { params: { days } }),
    api.get("/analytics/orders", { params: { days } }),
    api.get("/analytics/dau"),
    api.get("/analytics/conversion"),
    api.get("/analytics/aov"),
    api.get("/analytics/repeat-customers"),
    api.get("/analytics/revenue-trend", { params: { days } }),
    api.get("/analytics/orders-trend", { params: { days } }),
    api.get("/analytics/dau-trend", { params: { days } }),
    api.get("/analytics/top-products"),
    api.get("/analytics/sales-by-category"),
    api.get("/analytics/top-users", { params: { limit: 10, days } }),
    api.get("/analytics/customer-breakdown", { params: { days } }),
    api.get("/analytics/customer-repeat-rate", { params: { days } }),
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