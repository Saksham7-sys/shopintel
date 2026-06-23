import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default api;

/* ---------------- Dashboard KPIs ---------------- */

export const getTotalRevenue = async (days = 30) => {
  const res = await api.get(`/analytics/total-revenue?days=${days}`);
  return res.data;
};

export const getTotalOrders = async (days = 30) => {
  const res = await api.get(`/analytics/total-orders?days=${days}`);
  return res.data;
};

export const getAverageOrderValue = async (days = 30) => {
  const res = await api.get(`/analytics/average-order-value?days=${days}`);
  return res.data;
};

export const getDailyActiveUsers = async (days = 30) => {
  const res = await api.get(`/analytics/daily-active-users?days=${days}`);
  return res.data;
};

/* ---------------- Analytics Charts / Tables ---------------- */

export const getRevenueTrend = async (days = 30) => {
  const res = await api.get(`/analytics/revenue-trend?days=${days}`);
  return res.data;
};

export const getOrdersTrend = async (days = 30) => {
  const res = await api.get(`/analytics/orders-trend?days=${days}`);
  return res.data;
};

export const getDAUTrend = async (days = 30) => {
  const res = await api.get(`/analytics/dau-trend?days=${days}`);
  return res.data;
};

export const getEventFunnel = async (days = 30) => {
  const res = await api.get(`/analytics/event-funnel?days=${days}`);
  return res.data;
};

export const getCategorySummary = async (days = 30) => {
  const res = await api.get(`/analytics/category-summary?days=${days}`);
  return res.data;
};

export const getTopUsers = async (days = 30, limit = 10) => {
  const res = await api.get(
    `/analytics/top-users?days=${days}&limit=${limit}`
  );
  return res.data;
};

export const getNewVsReturning = async (days = 30) => {
  const res = await api.get(`/analytics/new-vs-returning?days=${days}`);
  return res.data;
};

/* ---------------- Forecasting ---------------- */

export const getForecastRevenue = async (days = 7) => {
  const res = await api.get(`/analytics/revenue-forecast?days=${days}`);
  return res.data;
};