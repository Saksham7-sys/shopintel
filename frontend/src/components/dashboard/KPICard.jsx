function KPICard({ title, value, subtitle }) {
  return (
    <div className="card p-5">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="mt-3 text-2xl font-bold text-slate-900">{value}</h3>
      {subtitle ? (
        <p className="mt-2 text-xs text-slate-400">{subtitle}</p>
      ) : null}
    </div>
  );
}

export default KPICard;