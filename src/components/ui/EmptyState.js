import Link from "next/link";

export default function EmptyState({
  title = "Nothing here yet",
  description = "There is no data to display.",
  actionText,
  actionHref,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <div className="mx-auto max-w-md">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>

        <p className="mt-2 text-sm text-slate-500">{description}</p>

        {actionText && actionHref && (
          <Link
            href={actionHref}
            className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {actionText}
          </Link>
        )}
      </div>
    </div>
  );
}
