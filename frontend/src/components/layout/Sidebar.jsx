function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-slate-950 text-white">
      <div className="px-6 py-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight">ShopIntel</h1>
        <p className="text-sm text-slate-400 mt-1">
          Ecommerce Analytics Dashboard
        </p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="rounded-xl bg-slate-900 px-4 py-3">
          <p className="text-sm font-medium">Dashboard</p>
          <p className="text-xs text-slate-400 mt-1">
            KPIs, trends, forecast, customers
          </p>
        </div>

        <div className="rounded-xl px-4 py-3 hover:bg-slate-900 transition">
          <p className="text-sm font-medium text-slate-200">Analytics</p>
        </div>

        <div className="rounded-xl px-4 py-3 hover:bg-slate-900 transition">
          <p className="text-sm font-medium text-slate-200">Forecasting</p>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="rounded-xl bg-slate-900 p-4">
          <p className="text-xs text-slate-400">Backend-powered dashboard</p>
          <p className="text-sm font-medium mt-1">FastAPI + PostgreSQL + ML</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;