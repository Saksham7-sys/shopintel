import { NavLink } from "react-router-dom";

const navItems = [
  {
    label: "Dashboard",
    path: "/",
    desc: "Overview KPIs and charts",
  },
  {
    label: "Analytics",
    path: "/analytics",
    desc: "Filtered deep-dive analytics",
  },
  {
    label: "Forecasting",
    path: "/forecasting",
    desc: "Revenue forecast and ML output",
  },
];

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
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 transition ${
                isActive
                  ? "bg-slate-900 border border-slate-800"
                  : "hover:bg-slate-900"
              }`
            }
          >
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="rounded-xl bg-slate-900 p-4">
          <p className="text-xs text-slate-400">Project stack</p>
          <p className="text-sm font-medium mt-1">
            FastAPI · PostgreSQL · React · ML Forecasting
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;