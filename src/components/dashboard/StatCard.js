export default function StatCard({
  title,
  value,
  description,
  icon,
  badgeText,
  badgeType = "blue",
  onClick,
}) {
  const badgeStyles = {
    blue: "bg-blue-50 text-blue-700 border-blue-200/60",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    amber: "bg-amber-50 text-amber-700 border-amber-200/60",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
  };

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/5 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      {/* Subtle background decoration */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-50/50 transition-all duration-300 group-hover:scale-125 group-hover:bg-blue-100/40" />

      <div className="relative z-10 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>

          {icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100 transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white group-hover:ring-blue-600">
              {icon}
            </div>
          )}
        </div>

        <div className="mt-3">
          <h3 className="text-3xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-blue-900">
            {value}
          </h3>

          <div className="mt-2.5 flex items-center gap-2">
            {badgeText && (
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                  badgeStyles[badgeType] || badgeStyles.blue
                }`}
              >
                {badgeText}
              </span>
            )}

            {description && (
              <p className="text-xs font-medium text-slate-500">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

