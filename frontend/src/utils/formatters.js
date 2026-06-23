export function formatCurrency(value) {
  const num = Number(value || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatNumber(value) {
  const num = Number(value || 0);
  return new Intl.NumberFormat("en-IN").format(num);
}

export function formatPercent(value) {
  const num = Number(value || 0);
  return `${num.toFixed(2)}%`;
}

export function shortCurrency(value) {
  const num = Number(value || 0);

  if (Math.abs(num) >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)}Cr`;
  }
  if (Math.abs(num) >= 100000) {
    return `₹${(num / 100000).toFixed(2)}L`;
  }
  if (Math.abs(num) >= 1000) {
    return `₹${(num / 1000).toFixed(1)}K`;
  }
  return `₹${num.toFixed(0)}`;
}

export function buildFilterParams(filters = {}) {
  const params = {};

  if (filters.days !== undefined && filters.days !== null && filters.days !== "") {
    params.days = filters.days;
  }
  if (filters.start_date) {
    params.start_date = filters.start_date;
  }
  if (filters.end_date) {
    params.end_date = filters.end_date;
  }

  return params;
}