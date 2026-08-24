"use client";

import Button from "@/components/ui/Button";

export default function PostCard({ post, onEdit, onDelete }) {
  const isPublished = post.status === "Published";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Top section */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {post.topic}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {post.location?.businessName || "Unknown location"}
            </p>
          </div>

          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              isPublished
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {post.status}
          </span>
        </div>

        {/* Content preview */}
        <p className="line-clamp-3 text-sm leading-6 text-slate-600">
          {post.content}
        </p>

        {/* Meta information */}
        <div className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Post Type
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {post.postType || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              CTA
            </p>

            <p className="mt-1 text-sm text-slate-700">{post.cta || "None"}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Created
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
          <Button variant="secondary" onClick={() => onEdit(post)}>
            Edit
          </Button>

          <Button variant="danger" onClick={() => onDelete(post)}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
