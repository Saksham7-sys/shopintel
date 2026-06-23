import { formatCurrency, formatNumber } from "../../utils/formatters";

function TopUsersTable({ data = [] }) {
  return (
    <div className="card p-5">
      <div className="mb-4">
        <h3 className="section-title">Top Users</h3>
        <p className="text-sm text-slate-500 mt-1">
          Highest spenders in the selected time window
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-100">
              <th className="py-3 pr-4">User</th>
              <th className="py-3 pr-4">Email</th>
              <th className="py-3 pr-4">Orders</th>
              <th className="py-3">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td className="py-4 text-slate-400" colSpan={4}>
                  No user data available
                </td>
              </tr>
            ) : (
              data.slice(0, 10).map((item) => (
                <tr
                  key={item.user_id}
                  className="border-b border-slate-50 last:border-b-0"
                >
                  <td className="py-3 pr-4 font-medium text-slate-800">
                    {item.name}
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{item.email}</td>
                  <td className="py-3 pr-4 text-slate-600">
                    {formatNumber(item.total_orders)}
                  </td>
                  <td className="py-3 text-slate-600">
                    {formatCurrency(item.total_spent)}
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

export default TopUsersTable;