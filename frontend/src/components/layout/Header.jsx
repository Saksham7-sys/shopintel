function Header({ days, setDays }) {
  const filters = [7, 30, 90];

  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
          ShopIntel Dashboard
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Revenue, orders, customers, funnel analytics, and ML forecast
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">Time window</span>
        <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          {filters.map((value) => (
            <button
              key={value}
              onClick={() => setDays(value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                days === value
                  ? "bg-brand-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {value}d
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Header;