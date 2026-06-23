import { formatCurrency } from "../../utils/formatters";

function ForecastSummaryCard({ summary }) {
  return (
    <div className="card p-5">
      <div className="mb-4">
        <h3 className="section-title">Revenue Forecast Summary</h3>
        <p className="text-sm text-slate-500 mt-1">
          Predicted performance for the next {summary?.forecast_days ?? 7} days
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Total Predicted Revenue</p>
          <p className="mt-2 text-lg font-bold text-slate-900">
            {formatCurrency(summary?.total_predicted_revenue ?? 0)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Average Predicted Revenue</p>
          <p className="mt-2 text-lg font-bold text-slate-900">
            {formatCurrency(summary?.average_predicted_revenue ?? 0)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Max Predicted Revenue</p>
          <p className="mt-2 text-lg font-bold text-slate-900">
            {formatCurrency(summary?.max_predicted_revenue ?? 0)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Min Predicted Revenue</p>
          <p className="mt-2 text-lg font-bold text-slate-900">
            {formatCurrency(summary?.min_predicted_revenue ?? 0)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForecastSummaryCard;