import { useState } from "react";

function FilterBar({ filters, onApply }) {
  const [localFilters, setLocalFilters] = useState({
    days: filters.days ?? 30,
    start_date: filters.start_date ?? "",
    end_date: filters.end_date ?? "",
  });

  const setField = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const quickDayButtons = [7, 30, 90];

  return (
    <div className="card p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Quick Range (days)
            </label>
            <div className="flex flex-wrap gap-2">
              {quickDayButtons.map((value) => (
                <button
                  key={value}
                  onClick={() => {
                    setLocalFilters({
                      days: value,
                      start_date: "",
                      end_date: "",
                    });
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                    Number(localFilters.days) === value &&
                    !localFilters.start_date &&
                    !localFilters.end_date
                      ? "bg-brand-600 text-white border-brand-600"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {value}d
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={localFilters.start_date}
              onChange={(e) => {
                setField("start_date", e.target.value);
                setField("days", "");
              }}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={localFilters.end_date}
              onChange={(e) => {
                setField("end_date", e.target.value);
                setField("days", "");
              }}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setLocalFilters({
                days: 30,
                start_date: "",
                end_date: "",
              });
              onApply({
                days: 30,
                start_date: "",
                end_date: "",
              });
            }}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium hover:bg-slate-50"
          >
            Reset
          </button>

          <button
            onClick={() => onApply(localFilters)}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-3">
        Use either quick day filters or a custom start/end date range.
      </p>
    </div>
  );
}

export default FilterBar;