export const APP_NAME = "GBP Post Manager";

export const POST_STATUS = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
};

export const STORAGE_KEYS = {
  USER: "gbpUser",
  TOKEN: "gbpToken",
  POSTS: "gbpPosts",
  POST_PREVIEW: "gbpPostPreview",
  POST_EDIT: "gbpPostEdit",
};

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  LOCATIONS: "/locations",
  POSTS: "/posts",
  CREATE_POST: "/posts/create",
  PREVIEW_POST: "/posts/preview",
};

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    ME: "/auth/me",
  },

  POSTS: "/posts",

  LOCATIONS: "/locations",

  AI_GENERATE: "/ai/generate",
};
