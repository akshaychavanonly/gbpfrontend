"use client";

import { useMemo } from "react";

import {
  useHydrated,
  useStorageValue,
  setStorageValue,
  refreshStorageValue,
} from "@/hooks/useStorageValue";

import { STORAGE_KEYS } from "@/utils/constants";

export default function usePosts() {
  const hydrated = useHydrated();

  const storedPosts = useStorageValue("localStorage", STORAGE_KEYS.POSTS);

  const { posts, error } = useMemo(() => {
    if (!storedPosts) {
      return {
        posts: [],
        error: "",
      };
    }

    try {
      const parsed = JSON.parse(storedPosts);

      return {
        posts: Array.isArray(parsed) ? parsed : [],
        error: "",
      };
    } catch (err) {
      console.error("Failed to parse posts:", err);

      return {
        posts: [],
        error: "Unable to load posts.",
      };
    }
  }, [storedPosts]);

  const savePosts = (updatedPosts) => {
    setStorageValue(
      "localStorage",
      STORAGE_KEYS.POSTS,
      JSON.stringify(updatedPosts),
    );
  };

  const loadPosts = () => {
    refreshStorageValue("localStorage", STORAGE_KEYS.POSTS);
  };

  const addPost = (postData) => {
    const newPost = {
      ...postData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    const updatedPosts = [newPost, ...posts];

    savePosts(updatedPosts);

    return newPost;
  };

  const updatePost = (postId, updatedData) => {
    const updatedPosts = posts.map((post) =>
      String(post.id) === String(postId)
        ? {
            ...post,
            ...updatedData,
            updatedAt: new Date().toISOString(),
          }
        : post,
    );

    savePosts(updatedPosts);
  };

  const deletePost = (postId) => {
    const updatedPosts = posts.filter(
      (post) => String(post.id) !== String(postId),
    );

    savePosts(updatedPosts);
  };

  const publishPost = (postId) => {
    updatePost(postId, {
      status: "Published",
    });
  };

  const getPostById = (postId) => {
    return posts.find((post) => String(post.id) === String(postId));
  };

  return {
    posts,
    loading: !hydrated,
    error,
    loadPosts,
    addPost,
    updatePost,
    deletePost,
    publishPost,
    getPostById,
  };
}
