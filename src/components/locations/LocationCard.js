"use client";

import { useRouter } from "next/navigation";

export default function LocationCard({
  location,
  onEdit,
  onDelete,
}) {
  const router = useRouter();

  const handleCreatePost = () => {
    router.push(
      `/posts/create?location=${location.id}`
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          {location.businessName}
        </h2>

        <div className="mt-4 space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Address
            </p>

            <p className="mt-1 text-sm text-slate-600">
              {location.address}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              City
            </p>

            <p className="mt-1 text-sm text-slate-600">
              {location.city}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Category
            </p>

            <p className="mt-1 text-sm text-slate-600">
              {location.category}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              onEdit(location)
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(location)
            }
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>

          <button
            type="button"
            onClick={handleCreatePost}
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Create Post
          </button>
        </div>
      </div>
    </div>
  );
}