"use client";

export default function PostFilters({ status, onStatusChange }) {
  const filters = ["All", "Draft", "Published"];

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Status
      </label>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = status === filter;

          return (
            <button
              key={filter}
              type="button"
              onClick={() => onStatusChange(filter)}
              className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
