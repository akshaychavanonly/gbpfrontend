"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import StatCard from "@/components/dashboard/StatCard";
import RecentPosts from "@/components/dashboard/RecentPosts";

import { useAuth } from "@/context/AuthContext";
import { getPosts } from "@/services/postService";
import { getLocations } from "@/services/locationService";

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();

  const [posts, setPosts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
   * Load posts and locations from Node.js + MongoDB backend.
   */
  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      if (authLoading) return;

      setLoading(true);

      if (token) {
        try {
          const [postsRes, locsRes] = await Promise.allSettled([
            getPosts(token),
            getLocations(token),
          ]);

          if (!isMounted) return;

          if (postsRes.status === "fulfilled" && postsRes.value?.posts) {
            setPosts(postsRes.value.posts);
          } else {
            // Local fallback
            const storedPosts =
              JSON.parse(localStorage.getItem("gbpPosts")) || [];
            if (Array.isArray(storedPosts)) setPosts(storedPosts);
          }

          if (locsRes.status === "fulfilled" && locsRes.value?.locations) {
            setLocations(locsRes.value.locations);
          }
        } catch (error) {
          console.error("Failed to load dashboard data:", error);
        } finally {
          if (isMounted) setLoading(false);
        }
      } else {
        // Fallback for non-authenticated state
        try {
          const storedPosts =
            JSON.parse(localStorage.getItem("gbpPosts")) || [];
          if (Array.isArray(storedPosts)) {
            setPosts(storedPosts);
          }
        } catch (error) {
          console.error("Failed to load posts from storage:", error);
        } finally {
          if (isMounted) setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [token, authLoading]);

  /*
   * Dashboard statistics
   */
  const totalLocations = locations.length;
  const totalPosts = posts.length;
  const draftPosts = posts.filter((post) => post.status === "Draft").length;
  const publishedPosts = posts.filter(
    (post) => post.status === "Published",
  ).length;

  const publishedPercent =
    totalPosts > 0 ? Math.round((publishedPosts / totalPosts) * 100) : 0;

  /*
   * Show only the latest 5 posts.
   */
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((post) => ({
      id: post._id || post.id,
      topic: post.topic,
      location:
        post.location?.name ||
        post.location?.businessName ||
        (typeof post.location === "string"
          ? post.location
          : "Unknown location"),
      status: post.status,
      date: post.createdAt
        ? new Date(post.createdAt).toLocaleDateString()
        : "-",
    }));

  return (
    <div className="space-y-8">
      {/* Blue & White Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white shadow-xl shadow-blue-500/10 sm:p-8">
        {/* Background ambient accents */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 right-48 h-48 w-48 rounded-full bg-blue-400/20 blur-xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-blue-100 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Google Business Profile Dashboard
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl text-white">
              Welcome back{user?.name ? `, ${user.name}` : ""} 👋
            </h1>

            <p className="text-sm font-normal leading-relaxed text-blue-100/90 sm:text-base">
              Generate AI-powered posts, monitor profile publishing metrics, and drive local customer engagement across your business locations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/posts/create")}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-md shadow-black/10 transition-all hover:bg-blue-50 hover:shadow-lg active:scale-95"
            >
              <svg
                className="h-4 w-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create AI Post
            </button>

            <button
              type="button"
              onClick={() => router.push("/locations")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95"
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Locations
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Locations"
          value={loading ? "..." : totalLocations}
          badgeText="Active Branches"
          badgeType="blue"
          description="Business profiles connected"
          icon={
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          }
          onClick={() => router.push("/locations")}
        />

        <StatCard
          title="Total Posts"
          value={loading ? "..." : totalPosts}
          badgeText="All Time"
          badgeType="indigo"
          description="Generated GBP updates"
          icon={
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
          onClick={() => router.push("/posts")}
        />

        <StatCard
          title="Draft Posts"
          value={loading ? "..." : draftPosts}
          badgeText={`${draftPosts} In Pipeline`}
          badgeType="amber"
          description="Ready for review/edit"
          icon={
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          }
          onClick={() => router.push("/posts")}
        />

        <StatCard
          title="Published Posts"
          value={loading ? "..." : publishedPosts}
          badgeText={`${publishedPercent}% Rate`}
          badgeType="emerald"
          description="Live on Search & Maps"
          icon={
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          onClick={() => router.push("/posts")}
        />
      </div>

      {/* Middle Section: Publishing Pipeline & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Publishing Pipeline Overview */}
        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Publishing Pipeline Overview
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Status breakdown of all your Google Business Profile content
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
              {totalPosts} Total Content Items
            </span>
          </div>

          {/* Progress bar visual */}
          <div className="mt-6 space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700">
                  Publication Completion ({publishedPercent}%)
                </span>
                <span className="text-blue-600">
                  {publishedPosts} of {totalPosts} Live
                </span>
              </div>

              <div className="h-3.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 ring-1 ring-slate-200/50">
                <div className="flex h-full w-full overflow-hidden rounded-full">
                  <div
                    style={{ width: `${publishedPercent}%` }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                  />
                  <div
                    style={{
                      width: `${
                        totalPosts > 0
                          ? Math.round((draftPosts / totalPosts) * 100)
                          : 0
                      }%`,
                    }}
                    className="bg-amber-400 transition-all duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Legend cards */}
            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/40 p-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Published</p>
                    <p className="text-xs text-slate-500">Live on Google Profiles</p>
                  </div>
                </div>
                <span className="text-base font-extrabold text-emerald-700">
                  {publishedPosts}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/40 p-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="h-3 w-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Drafts</p>
                    <p className="text-xs text-slate-500">Awaiting review / schedule</p>
                  </div>
                </div>
                <span className="text-base font-extrabold text-amber-700">
                  {draftPosts}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Launchpad */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/60 to-white p-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm shadow-blue-600/30">
                ⚡
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Quick Shortcuts
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Jump straight into common workflows
            </p>

            <div className="mt-4 space-y-2.5">
              <Link
                href="/posts/create"
                className="group flex items-center justify-between rounded-xl border border-blue-200/70 bg-white p-3 shadow-xs transition hover:border-blue-400 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    ✨
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      AI Post Generator
                    </p>
                    <p className="text-xs text-slate-500">
                      Create with OpenRouter
                    </p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:translate-x-0.5 group-hover:text-blue-600 transition-all text-xs">
                  →
                </span>
              </Link>

              <Link
                href="/locations"
                className="group flex items-center justify-between rounded-xl border border-blue-200/70 bg-white p-3 shadow-xs transition hover:border-blue-400 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    📍
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Manage Locations
                    </p>
                    <p className="text-xs text-slate-500">
                      {totalLocations} branches registered
                    </p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:translate-x-0.5 group-hover:text-blue-600 transition-all text-xs">
                  →
                </span>
              </Link>

              <Link
                href="/posts"
                className="group flex items-center justify-between rounded-xl border border-blue-200/70 bg-white p-3 shadow-xs transition hover:border-blue-400 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    📑
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Browse All Posts
                    </p>
                    <p className="text-xs text-slate-500">
                      Filter & manage drafts
                    </p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:translate-x-0.5 group-hover:text-blue-600 transition-all text-xs">
                  →
                </span>
              </Link>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-blue-600/5 p-3 text-center border border-blue-100">
            <p className="text-xs font-medium text-blue-900">
              💡 Tip: Generate posts in Hindi or Kannada directly with AI.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Posts Table Section */}
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-blue-100 bg-white py-16 shadow-sm">
            <div className="h-9 w-9 animate-spin rounded-full border-3 border-blue-100 border-t-blue-600" />
            <p className="mt-3 text-xs font-semibold text-slate-500">
              Loading recent Google Business Profile posts...
            </p>
          </div>
        ) : (
          <RecentPosts posts={recentPosts} />
        )}
      </div>
    </div>
  );
}

