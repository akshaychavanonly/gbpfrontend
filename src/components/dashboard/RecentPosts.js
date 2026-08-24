import Link from "next/link";

export default function RecentPosts({ posts = [] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition-all hover:shadow-md hover:shadow-blue-500/5">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-blue-100 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Recent Posts</h2>
              {posts.length > 0 && (
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-200/60">
                  {posts.length} latest
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              Your most recently created Google Business Profile posts
            </p>
          </div>
        </div>

        <Link
          href="/posts"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-800 hover:underline"
        >
          View all posts
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 ring-8 ring-blue-50/50">
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h3 className="mt-4 text-base font-semibold text-slate-900">
            No posts created yet
          </h3>

          <p className="mt-1 max-w-sm text-xs text-slate-500">
            Generate and publish your first Google Business Profile post with AI to drive customer engagement.
          </p>

          <Link
            href="/posts/create"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 transition hover:bg-blue-700"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-blue-100 bg-blue-50/40">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-blue-900">
                  Topic
                </th>

                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-blue-900">
                  Location
                </th>

                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-blue-900">
                  Status
                </th>

                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-blue-900">
                  Date
                </th>

                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-blue-900">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {posts.map((post) => {
                const isPublished = post.status === "Published";

                return (
                  <tr
                    key={post.id}
                    className="transition-colors hover:bg-blue-50/30"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {post.topic}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <svg
                          className="h-4 w-4 shrink-0 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="truncate">{post.location}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                          isPublished
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                            : "bg-amber-50 text-amber-700 ring-amber-600/20"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isPublished ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        {post.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs font-medium text-slate-500">
                      {post.date}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/posts/${post.id}/edit`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-800"
                      >
                        Edit
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
