"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/layout/PageHeader";
import PostSearch from "@/components/posts/PostSearch";
import PostFilters from "@/components/posts/PostFilters";
import PostTable from "@/components/posts/PostTable";
import PostCard from "@/components/posts/PostCard";

import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";

import { useAuth } from "@/context/AuthContext";
import { getPosts, deletePost as deletePostApi } from "@/services/postService";

export default function PostsPage() {
  const router = useRouter();
  const { token, loading: authLoading } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /*
   * Convert backend MongoDB post to shape
   * expected by PostCard and PostTable.
   */
  const normalizePost = (post) => ({
    id: post._id || post.id,
    _id: post._id || post.id,
    topic: post.topic,
    postType: post.postType,
    tone: post.tone,
    language: post.language,
    content: post.content,
    cta: post.cta || "None",
    status: post.status || "Draft",
    locationId:
      post.location?._id ||
      post.location?.id ||
      (typeof post.location === "string" ? post.location : ""),
    location:
      post.location && typeof post.location === "object"
        ? {
            id: post.location._id || post.location.id,
            _id: post.location._id || post.location.id,
            businessName: post.location.name || post.location.businessName,
            name: post.location.name || post.location.businessName,
            city: post.location.city,
            address: post.location.address,
            category: post.location.category,
          }
        : typeof post.location === "string"
          ? { businessName: post.location }
          : null,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  });

  /*
   * Load posts from Node.js + MongoDB backend API.
   */
  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      if (authLoading) return;

      if (!token) {
        // Fallback to local storage if not authenticated
        try {
          const storedPosts =
            JSON.parse(localStorage.getItem("gbpPosts")) || [];
          if (isMounted && Array.isArray(storedPosts)) {
            setPosts(storedPosts.map(normalizePost));
          }
        } catch (err) {
          console.error("Failed to load local posts:", err);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
        return;
      }

      setError("");

      try {
        const data = await getPosts(token);
        if (isMounted) {
          const formattedPosts = (data.posts || []).map(normalizePost);
          setPosts(formattedPosts);
        }
      } catch (err) {
        console.error("Failed to load posts from API:", err);
        if (isMounted) {
          setError(err.message || "Unable to load posts from server.");

          // Graceful fallback to local storage
          try {
            const storedPosts =
              JSON.parse(localStorage.getItem("gbpPosts")) || [];
            if (Array.isArray(storedPosts) && storedPosts.length > 0) {
              setPosts(storedPosts.map(normalizePost));
            }
          } catch (fallbackErr) {
            console.error("Fallback load failed:", fallbackErr);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, [token, authLoading]);

  /*
   * Search + filter posts.
   */
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        post.topic?.toLowerCase().includes(searchValue) ||
        post.content?.toLowerCase().includes(searchValue) ||
        post.location?.businessName?.toLowerCase().includes(searchValue) ||
        post.location?.name?.toLowerCase().includes(searchValue) ||
        post.location?.city?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || post.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [posts, search, statusFilter]);

  /*
   * Edit Post
   *
   * Store the selected post in sessionStorage
   * and navigate to the edit page.
   */
  const handleEdit = (post) => {
    sessionStorage.setItem("gbpPostEdit", JSON.stringify(post));
    router.push(`/posts/${post.id}/edit`);
  };

  /*
   * Open delete confirmation modal.
   */
  const handleDeleteClick = (post) => {
    setDeleteTarget(post);
  };

  /*
   * Delete selected post via API (and sync local state).
   */
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleteLoading(true);

    try {
      if (token) {
        await deletePostApi(deleteTarget.id, token);
      }

      const updatedPosts = posts.filter((post) => post.id !== deleteTarget.id);
      setPosts(updatedPosts);

      // Keep localStorage in sync if present
      try {
        const storedPosts = JSON.parse(localStorage.getItem("gbpPosts")) || [];
        const filteredStorage = storedPosts.filter(
          (post) => (post._id || post.id) !== deleteTarget.id,
        );
        localStorage.setItem("gbpPosts", JSON.stringify(filteredStorage));
      } catch (storageErr) {
        console.error("Failed to sync storage on delete:", storageErr);
      }

      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete post:", err);
      setError(err.message || "Unable to delete post. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  /*
   * Reset search and filter.
   */
  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  return (
    <div>
      <PageHeader
        title="Posts"
        description="View and manage your draft and published GBP posts."
        action={
          <Button onClick={() => router.push("/posts/create")}>
            + Create Post
          </Button>
        }
      />

      {/* Error Banner */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2 md:items-end">
          <PostSearch
            value={search}
            onChange={setSearch}
            placeholder="Search by topic, content, location..."
          />

          <PostFilters status={statusFilter} onStatusChange={setStatusFilter} />
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-12 text-center shadow-sm">
          <Loader text="Loading posts..." />
        </div>
      ) : (
        <>
          {/* Result Count */}
          {posts.length > 0 && (
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {filteredPosts.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {posts.length}
                </span>{" "}
                posts
              </p>

              {(search || statusFilter !== "All") && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* No posts at all */}
          {posts.length === 0 ? (
            <EmptyState
              title="No posts yet"
              description="Create your first Google Business Profile post to get started."
              actionText="Create Post"
              actionHref="/posts/create"
            />
          ) : filteredPosts.length === 0 ? (
            /*
             * Posts exist, but none match
             * the current search/filter.
             */
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <h3 className="text-lg font-semibold text-slate-900">
                No matching posts
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or status filter.
              </p>

              <Button
                variant="secondary"
                className="mt-5"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              {/* Mobile */}
              <div className="space-y-4 md:hidden">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>

              {/* Desktop */}
              <div className="hidden md:block">
                <PostTable
                  posts={filteredPosts}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              </div>
            </>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        title="Delete Post"
        onClose={() => !deleteLoading && setDeleteTarget(null)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete Post"}
            </Button>
          </>
        }
      >
        <p className="text-sm leading-6 text-slate-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-900">
            {deleteTarget?.topic}
          </span>
          ? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
