"use client";

import Button from "@/components/ui/Button";

export default function PostPreview({
  post,
  onEdit,
  onSaveDraft,
  onPublish,
  loading = false,
}) {
  if (!post) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          No preview available
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Please create a post before viewing the preview.
        </p>

        <div className="mt-5">
          <Button onClick={onEdit}>Create Post</Button>
        </div>
      </div>
    );
  }

  const location = post.location;

  return (
    <div className="space-y-6">
      {/* Preview Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Post Preview
          </p>

          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            {location?.businessName || "Business Name"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {location
              ? `${location.address}, ${location.city}`
              : "Business location"}
          </p>
        </div>

        <div className="space-y-6 p-6">
          {/* Post Information */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Post Type
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {post.postType}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Tone
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {post.tone}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Language
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {post.language}
              </p>
            </div>
          </div>

          {/* Topic */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Topic
            </p>

            <p className="mt-2 text-sm font-medium text-slate-900">
              {post.topic}
            </p>
          </div>

          {/* Content */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Post Content
            </p>

            <div className="mt-2 whitespace-pre-line rounded-xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
              {post.content}
            </div>
          </div>

          {/* CTA */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Call to Action
            </p>

            {post.cta && post.cta !== "None" ? (
              <button
                type="button"
                className="mt-3 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
              >
                {post.cta}
              </button>
            ) : (
              <p className="mt-2 text-sm text-slate-500">
                No call to action selected.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={onEdit}
          disabled={loading}
        >
          Back to Edit
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={onSaveDraft}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Draft"}
        </Button>

        <Button type="button" onClick={onPublish} disabled={loading}>
          {loading ? "Publishing..." : "Publish"}
        </Button>
      </div>
    </div>
  );
}
