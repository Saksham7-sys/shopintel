function StatBox({ label, value, className = "" }) {
  return (
    <div className={`rounded-xl bg-slate-50 p-4 ${className}`}>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default StatBox;