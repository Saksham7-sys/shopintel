import { formatNumber, formatPercent } from "../../utils/formatters";

function CustomerBreakdownCard({ breakdown, repeatRate }) {
  const total = breakdown?.total_customers ?? 0;
  const newCustomers = breakdown?.new_customers ?? 0;
  const returningCustomers = breakdown?.returning_customers ?? 0;
  const rate = repeatRate?.repeat_rate ?? 0;

  return (
    <div className="card p-5">
      <div className="mb-4">
        <h3 className="section-title">Customer Breakdown</h3>
        <p className="text-sm text-slate-500 mt-1">
          New vs returning customers in selected window
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Total Customers</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatNumber(total)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-blue-50 p-4">
            <p className="text-sm text-slate-500">New Customers</p>
            <p className="mt-2 text-xl font-bold text-slate-900">
              {formatNumber(newCustomers)}
            </p>
          </div>

          <div className="rounded-xl bg-emerald-50 p-4">
            <p className="text-sm text-slate-500">Returning Customers</p>
            <p className="mt-2 text-xl font-bold text-slate-900">
              {formatNumber(returningCustomers)}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-brand-50 p-4">
          <p className="text-sm text-slate-500">Repeat Rate</p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {formatPercent(rate)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CustomerBreakdownCard;