"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import RecentPosts from "@/components/dashboard/RecentPosts";
import Button from "@/components/ui/Button";

import { useAuth } from "@/context/AuthContext";
import { getPosts } from "@/services/postService";
import { getLocations } from "@/services/locationService";

export default function DashboardPage() {
  const router = useRouter();
  const { token, loading: authLoading } = useAuth();

  const [posts, setPosts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
   * Load posts and locations from Node.js + MongoDB backend.
   */
  useEffect(() => {
    const loadDashboardData = async () => {
      if (authLoading) return;

      setLoading(true);

      if (token) {
        try {
          const [postsRes, locsRes] = await Promise.allSettled([
            getPosts(token),
            getLocations(token),
          ]);

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
          setLoading(false);
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
          setLoading(false);
        }
      }
    };

    loadDashboardData();
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
    <div>
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        description="Overview of your Google Business Profile posts and locations."
        // action={
        //   <Button onClick={() => router.push("/posts/create")}>
        //     + Create Post
        //   </Button>
        // }
      />

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Locations"
          value={loading ? "..." : totalLocations}
          description="Business locations"
        />

        <StatCard
          title="Total Posts"
          value={loading ? "..." : totalPosts}
          description="All created posts"
        />

        <StatCard
          title="Draft Posts"
          value={loading ? "..." : draftPosts}
          description="Waiting to be published"
        />

        <StatCard
          title="Published Posts"
          value={loading ? "..." : publishedPosts}
          description="Published GBP posts"
        />
      </div>

      {/* Recent Posts */}
      <div className="mt-8">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-slate-500">Loading dashboard...</p>
          </div>
        ) : (
          <RecentPosts posts={recentPosts} />
        )}
      </div>
    </div>
  );
}
