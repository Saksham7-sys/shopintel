import { formatCurrency, formatNumber } from "../../utils/formatters";

function TopProductsTable({ data = [] }) {
  return (
    <div className="card p-5">
      <div className="mb-4">
        <h3 className="section-title">Top Products</h3>
        <p className="text-sm text-slate-500 mt-1">
          Best-performing products by order count and revenue
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-100">
              <th className="py-3 pr-4">Product</th>
              <th className="py-3 pr-4">Orders</th>
              <th className="py-3">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td className="py-4 text-slate-400" colSpan={3}>
                  No product data available
                </td>
              </tr>
            ) : (
              data.slice(0, 8).map((item, index) => (
                <tr
                  key={`${item.product_name}-${index}`}
                  className="border-b border-slate-50 last:border-b-0"
                >
                  <td className="py-3 pr-4 font-medium text-slate-800">
                    {item.product_name}
                  </td>
                  <td className="py-3 pr-4 text-slate-600">
                    {formatNumber(item.total_orders)}
                  </td>
                  <td className="py-3 text-slate-600">
                    {formatCurrency(item.revenue)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopProductsTable;