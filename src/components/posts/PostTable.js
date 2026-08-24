"use client";

import Button from "@/components/ui/Button";

export default function PostTable({ posts = [], onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Topic
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Location
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                CTA
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Created
              </th>

              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {posts.map((post) => {
              const isPublished = post.status === "Published";

              return (
                <tr key={post.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {post.topic}
                      </p>

                      <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                        {post.content}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {post.location?.businessName || "Unknown location"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {post.cta || "None"}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-500">
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" onClick={() => onEdit(post)}>
                        Edit
                      </Button>

                      <Button variant="danger" onClick={() => onDelete(post)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
