const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "gbpbackend-production-618a.up.railway.app/api";

/*
 * Helper to build authorization headers.
 */
function getAuthHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/*
 * Get all posts
 *
 * Optional query examples:
 * ?status=Draft
 * ?search=dental
 */
export async function getPosts(token, filters = {}) {
  const params = new URLSearchParams();

  if (filters.status && filters.status !== "All") {
    params.append("status", filters.status);
  }

  if (filters.search) {
    params.append("search", filters.search);
  }

  const queryString = params.toString();

  const url = queryString
    ? `${API_BASE_URL}/posts?${queryString}`
    : `${API_BASE_URL}/posts`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(token),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load posts.");
  }

  return data;
}

/*
 * Get one post by ID
 */
export async function getPostById(postId, token) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load post.");
  }

  return data;
}

/*
 * Create a post.
 *
 * status can be:
 * Draft
 * Published
 */
export async function createPost(postData, token) {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: "POST",

    headers: getAuthHeaders(token),

    body: JSON.stringify(postData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to create post.");
  }

  return data;
}

/*
 * Update an existing post
 */
export async function updatePost(postId, postData, token) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "PUT",

    headers: getAuthHeaders(token),

    body: JSON.stringify(postData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to update post.");
  }

  return data;
}

/*
 * Delete post
 */
export async function deletePost(postId, token) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to delete post.");
  }

  return data;
}

/*
 * Publish an existing post.
 *
 * Actual Google Business Profile publishing
 * is not required.
 *
 * Backend only needs to change:
 * status → Published
 */
export async function publishPost(postId, token) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/publish`, {
    method: "PATCH",
    headers: getAuthHeaders(token),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to publish post.");
  }

  return data;
}
