"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import AIContentGenerator from "@/components/posts/AIContentGenerator";
import CTASelector from "@/components/posts/CTASelector";

import { useAuth } from "@/context/AuthContext";
import { getLocations } from "@/services/locationService";
import {
  getPostById,
  updatePost as updatePostApi,
} from "@/services/postService";
import { postTypes, tones, languages } from "@/data/options";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { token, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    locationId: "",
    topic: "",
    postType: "",
    tone: "",
    language: "English",
    content: "",
    cta: "None",
  });

  const [originalPost, setOriginalPost] = useState(null);
  const [locations, setLocations] = useState([]);
  const [errors, setErrors] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /*
   * Load selected post.
   *
   * 1. Try to fetch from backend API if token is available.
   * 2. Otherwise try sessionStorage.
   * 3. Fallback to localStorage.
   */
  useEffect(() => {
    const loadPostData = async () => {
      if (authLoading) return;

      setPageLoading(true);
      setErrorMessage("");

      let post = null;

      // 1. Try API if authenticated
      if (token && params.id) {
        try {
          const data = await getPostById(params.id, token);
          if (data?.post) {
            post = data.post;
          }
        } catch (apiErr) {
          console.warn(
            "API post load failed, attempting local fallback:",
            apiErr,
          );
        }
      }

      // 2. Try sessionStorage
      if (!post) {
        try {
          const sessionPost = sessionStorage.getItem("gbpPostEdit");
          if (sessionPost) {
            const parsed = JSON.parse(sessionPost);
            if (String(parsed._id || parsed.id) === String(params.id)) {
              post = parsed;
            }
          }
        } catch (storageErr) {
          console.error("Failed to parse sessionStorage post:", storageErr);
        }
      }

      // 3. Fallback to localStorage
      if (!post) {
        try {
          const storedPosts =
            JSON.parse(localStorage.getItem("gbpPosts")) || [];
          post = storedPosts.find(
            (item) => String(item._id || item.id) === String(params.id),
          );
        } catch (storageErr) {
          console.error("Failed to parse localStorage posts:", storageErr);
        }
      }

      if (!post) {
        setErrorMessage("Post not found.");
        setPageLoading(false);
        return;
      }

      setOriginalPost(post);

      const locId =
        post.location?._id ||
        post.location?.id ||
        post.locationId ||
        (typeof post.location === "string" ? post.location : "");

      setFormData({
        locationId: String(locId || ""),
        topic: post.topic || "",
        postType: post.postType || "",
        tone: post.tone || "",
        language: post.language || "English",
        content: post.content || "",
        cta: post.cta || "None",
      });

      setPageLoading(false);
    };

    loadPostData();
  }, [params.id, token, authLoading]);

  useEffect(() => {
    const loadLocations = async () => {
      if (authLoading) {
        return;
      }

      if (!token) {
        setLocationsLoading(false);
        return;
      }

      setLocationsLoading(true);

      try {
        const data = await getLocations(token);
        setLocations(data.locations || []);
      } catch (error) {
        setErrorMessage(
          error.message || "Unable to load locations. Please try again.",
        );
      } finally {
        setLocationsLoading(false);
      }
    };

    loadLocations();
  }, [token, authLoading]);

  const locationOptions = locations.map((location) => ({
    value: String(location._id || location.id),
    label: `${location.name || location.businessName} - ${location.city}`,
  }));

  /*
   * Handle standard fields.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /*
   * Handle post content separately because
   * AIContentGenerator returns the content directly.
   */
  const handleContentChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));

    setErrors((prev) => ({
      ...prev,
      content: "",
    }));
  };

  /*
   * Handle CTA selection.
   */
  const handleCTAChange = (cta) => {
    setFormData((prev) => ({
      ...prev,
      cta,
    }));
  };

  /*
   * Validate form.
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.locationId) {
      newErrors.locationId = "Please select a business location.";
    }

    if (!formData.topic.trim()) {
      newErrors.topic = "Please enter a post topic.";
    }

    if (!formData.postType) {
      newErrors.postType = "Please select a post type.";
    }

    if (!formData.tone) {
      newErrors.tone = "Please select a tone.";
    }

    if (!formData.language) {
      newErrors.language = "Please select a language.";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Post content cannot be empty.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /*
   * Update the post via backend API (and sync localStorage/sessionStorage).
   */
  const handleSavePost = async (newStatus = null) => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setErrorMessage("");

    const targetStatus = newStatus || originalPost?.status || "Draft";

    const payload = {
      locationId: formData.locationId,
      topic: formData.topic.trim(),
      postType: formData.postType,
      tone: formData.tone,
      language: formData.language,
      content: formData.content.trim(),
      cta: formData.cta || "None",
      status: targetStatus,
    };

    try {
      let updatedPost = null;

      if (token) {
        const res = await updatePostApi(params.id, payload, token);
        updatedPost = res.post;
      }

      // Sync with localStorage
      try {
        const storedPosts = JSON.parse(localStorage.getItem("gbpPosts")) || [];
        const selectedLocation = locations.find(
          (location) =>
            String(location._id || location.id) === String(formData.locationId),
        );

        const localPostData = updatedPost || {
          ...originalPost,
          ...payload,
          locationId: formData.locationId,
          location: selectedLocation
            ? {
                id: selectedLocation._id || selectedLocation.id,
                _id: selectedLocation._id || selectedLocation.id,
                businessName:
                  selectedLocation.name || selectedLocation.businessName,
                name: selectedLocation.name || selectedLocation.businessName,
                city: selectedLocation.city,
                address: selectedLocation.address,
                category: selectedLocation.category,
              }
            : originalPost?.location,
          status: targetStatus,
          updatedAt: new Date().toISOString(),
        };

        const updatedPosts = storedPosts.map((post) =>
          String(post._id || post.id) === String(params.id)
            ? localPostData
            : post,
        );

        localStorage.setItem("gbpPosts", JSON.stringify(updatedPosts));
      } catch (storageErr) {
        console.error("Failed to sync storage:", storageErr);
      }

      sessionStorage.removeItem("gbpPostEdit");
      router.push("/posts");
    } catch (error) {
      console.error("Failed to update post:", error);
      setErrorMessage(
        error.message || "Unable to save the post. Please try again.",
      );
      setSaving(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSavePost();
  };

  /*
   * Allows a draft to be published directly
   * from the edit screen.
   */
  const handlePublish = () => {
    handleSavePost("Published");
  };

  if (pageLoading) {
    return <Loader text="Loading post..." />;
  }

  if (errorMessage && !originalPost) {
    return (
      <div>
        <PageHeader
          title="Edit Post"
          description="Update your Google Business Profile post."
        />

        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-lg font-semibold text-red-700">{errorMessage}</h2>

          <Button className="mt-5" onClick={() => router.push("/posts")}>
            Back to Posts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Edit Post"
        description="Update the content and settings for your GBP post."
      />

      {errorMessage && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Business Location
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select the location this post belongs to.
            </p>
          </div>

          <Select
            label="Location"
            id="locationId"
            name="locationId"
            value={formData.locationId}
            onChange={handleChange}
            options={locationOptions}
            placeholder={
              locationsLoading
                ? "Loading locations..."
                : "Select business location"
            }
            error={errors.locationId}
            required
            disabled={locationsLoading || saving}
          />

          {!locationsLoading && locations.length === 0 && (
            <p className="mt-2 text-sm text-slate-500">
              No locations found. Add a business location first.
            </p>
          )}
        </div>

        {/* Post information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Post Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Edit the details used to generate your post.
            </p>
          </div>

          <div className="space-y-5">
            <Input
              label="Post Topic"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="Enter post topic"
              error={errors.topic}
              required
            />

            <div className="grid gap-5 md:grid-cols-3">
              <Select
                label="Post Type"
                id="postType"
                name="postType"
                value={formData.postType}
                onChange={handleChange}
                options={postTypes}
                placeholder="Select post type"
                error={errors.postType}
                required
              />

              <Select
                label="Tone"
                id="tone"
                name="tone"
                value={formData.tone}
                onChange={handleChange}
                options={tones}
                placeholder="Select tone"
                error={errors.tone}
                required
              />

              <Select
                label="Language"
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                options={languages}
                placeholder="Select language"
                error={errors.language}
                required
              />
            </div>
          </div>
        </div>

        {/* AI Content */}
        <div>
          <AIContentGenerator
            locationId={formData.locationId}
            topic={formData.topic}
            postType={formData.postType}
            tone={formData.tone}
            language={formData.language}
            content={formData.content}
            onContentChange={handleContentChange}
          />

          {errors.content && (
            <p className="mt-2 text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Call to Action
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update the action customers should take.
            </p>
          </div>

          <CTASelector value={formData.cta} onChange={handleCTAChange} />
        </div>

        {/* Current status */}
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-sm text-slate-500">
            Current Status:{" "}
            <span
              className={`font-semibold ${
                originalPost?.status === "Published"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {originalPost?.status}
            </span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/posts")}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button type="submit" variant="secondary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>

          {originalPost?.status !== "Published" && (
            <Button type="button" onClick={handlePublish} disabled={saving}>
              {saving ? "Publishing..." : "Publish"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
