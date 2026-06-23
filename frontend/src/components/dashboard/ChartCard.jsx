function ChartCard({ title, subtitle, children, height = 300 }) {
  return (
    <div className="card p-5">
      <div className="mb-4">
        <h3 className="section-title">{title}</h3>
        {subtitle ? (
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        ) : null}
      </div>
      <div style={{ width: "100%", height }}>{children}</div>
    </div>
  );
}

export default ChartCard;