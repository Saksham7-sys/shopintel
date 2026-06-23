import { formatNumber, formatPercent } from "../../utils/formatters";

function FunnelCard({ funnel }) {
  const pageView = funnel?.page_view_users ?? 0;
  const productView = funnel?.product_view_users ?? 0;
  const addToCart = funnel?.add_to_cart_users ?? 0;
  const purchase = funnel?.purchase_users ?? 0;

  const conversionFromPageView =
    pageView > 0 ? ((purchase / pageView) * 100).toFixed(2) : "0.00";

  const steps = [
    { label: "Page View Users", value: pageView },
    { label: "Product View Users", value: productView },
    { label: "Add to Cart Users", value: addToCart },
    { label: "Purchase Users", value: purchase },
  ];

  return (
    <div className="card p-5">
      <div className="mb-4">
        <h3 className="section-title">Funnel Summary</h3>
        <p className="text-sm text-slate-500 mt-1">
          User movement from browsing to purchase
        </p>
      </div>

      <div className="space-y-3">
        {steps.map((step) => (
          <div
            key={step.label}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
          >
            <span className="text-sm text-slate-600">{step.label}</span>
            <span className="text-sm font-semibold text-slate-900">
              {formatNumber(step.value)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-emerald-50 p-4">
        <p className="text-sm text-slate-500">Page View → Purchase Rate</p>
        <p className="mt-2 text-xl font-bold text-slate-900">
          {formatPercent(Number(conversionFromPageView))}
        </p>
      </div>
    </div>
  );
}

export default FunnelCard;