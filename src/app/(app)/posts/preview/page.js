"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PostPreview from "@/components/posts/PostPreview";
import PageHeader from "@/components/layout/PageHeader";
import Loader from "@/components/ui/Loader";

import { useAuth } from "@/context/AuthContext";
import {
  publishPost,
  updatePost as updatePostApi,
} from "@/services/postService";
import {
  useHydrated,
  useStorageValue,
  setStorageValue,
  removeStorageValue,
} from "@/hooks/useStorageValue";

import { STORAGE_KEYS, POST_STATUS } from "@/utils/constants";

export default function PreviewPage() {
  const router = useRouter();
  const { token } = useAuth();
  const hydrated = useHydrated();

  const storedPreview = useStorageValue(
    "sessionStorage",
    STORAGE_KEYS.POST_PREVIEW,
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const post = useMemo(() => {
    if (!storedPreview) {
      return null;
    }

    try {
      return JSON.parse(storedPreview);
    } catch (error) {
      console.error("Failed to parse preview:", error);
      return null;
    }
  }, [storedPreview]);

  const handleEdit = () => {
    router.push("/posts/create");
  };

  const savePostLocally = (status) => {
    if (!post) {
      return;
    }

    let existingPosts = [];

    try {
      const storedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
      existingPosts = storedPosts ? JSON.parse(storedPosts) : [];

      if (!Array.isArray(existingPosts)) {
        existingPosts = [];
      }
    } catch (error) {
      console.error("Failed to read posts:", error);
      existingPosts = [];
    }

    const newPost = {
      ...post,
      id: post.id || post._id || Date.now(),
      status,
      createdAt: post.createdAt || new Date().toISOString(),
    };

    const targetId = String(post._id || post.id);
    const existingIndex = existingPosts.findIndex(
      (p) => String(p._id || p.id) === targetId,
    );

    let updatedPosts;
    if (existingIndex >= 0) {
      updatedPosts = existingPosts.map((p, i) =>
        i === existingIndex ? newPost : p,
      );
    } else {
      updatedPosts = [newPost, ...existingPosts];
    }

    setStorageValue(
      "localStorage",
      STORAGE_KEYS.POSTS,
      JSON.stringify(updatedPosts),
    );

    return newPost;
  };

  const handleSaveDraft = async () => {
    if (!post) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const targetId = post._id || post.id;
      if (token && targetId) {
        await updatePostApi(targetId, { status: POST_STATUS.DRAFT }, token);
      }

      savePostLocally(POST_STATUS.DRAFT);
      setMessage("Post saved as draft successfully.");

      setTimeout(() => {
        removeStorageValue("sessionStorage", STORAGE_KEYS.POST_PREVIEW);
        router.push("/posts");
      }, 700);
    } catch (err) {
      console.error("Failed to save draft:", err);
      setError(err.message || "Unable to save draft. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!post) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const targetId = post._id || post.id;
      if (token && targetId) {
        await publishPost(targetId, token);
      }

      savePostLocally(POST_STATUS.PUBLISHED);
      setMessage("Post published successfully.");

      setTimeout(() => {
        removeStorageValue("sessionStorage", STORAGE_KEYS.POST_PREVIEW);
        router.push("/posts");
      }, 700);
    } catch (err) {
      console.error("Failed to publish post:", err);
      setError(err.message || "Unable to publish post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <Loader text="Loading preview..." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Post Preview"
        description="Review your GBP post before saving or publishing."
      />

      {message && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-sm font-medium text-green-700">{message}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <PostPreview
        post={post}
        onEdit={handleEdit}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        loading={loading}
      />
    </div>
  );
}
