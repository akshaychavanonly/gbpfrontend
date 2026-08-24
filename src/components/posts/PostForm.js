"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

import AIContentGenerator from "@/components/posts/AIContentGenerator";
import CTASelector from "@/components/posts/CTASelector";

import { useAuth } from "@/context/AuthContext";
import { getLocations } from "@/services/locationService";
import { createPost } from "@/services/postService";
import { postTypes, tones, languages } from "@/data/options";

export default function PostForm({ initialLocationId = "" }) {
  const router = useRouter();
  const { token, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    locationId: initialLocationId ? String(initialLocationId) : "",
    topic: "",
    postType: "",
    tone: "",
    language: "English",
    content: "",
    cta: "None",
  });

  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [locationsError, setLocationsError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

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
      setLocationsError("");

      try {
        const data = await getLocations(token);

        setLocations(data.locations || []);
      } catch (error) {
        setLocationsError(
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
   * Handle normal input/select changes.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove the error for this field
    // once the user starts correcting it.
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /*
   * Handle AI generated / manually edited content.
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

    setErrors((prev) => ({
      ...prev,
      cta: "",
    }));
  };

  /*
   * Validate the form before going to preview.
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
      newErrors.content = "Please generate or enter post content.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /*
   * Create the post through the backend,
   * then move to preview.
   */
  const handlePreview = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!token) {
      setSubmitError("Please log in to create a post.");
      return;
    }

    const selectedLocation = locations.find(
      (location) =>
        String(location._id || location.id) === String(formData.locationId),
    );

    setSaving(true);
    setSubmitError("");

    try {
      const data = await createPost(
        {
          locationId: formData.locationId,
          topic: formData.topic.trim(),
          postType: formData.postType,
          tone: formData.tone,
          language: formData.language,
          content: formData.content.trim(),
          cta: formData.cta || "None",
          status: "Draft",
        },
        token,
      );

      const createdPost = data.post;
      const apiLocation = createdPost?.location;

      const postData = {
        ...formData,
        id: createdPost?._id || createdPost?.id,
        status: createdPost?.status || "Draft",
        location: apiLocation
          ? {
              id: apiLocation._id || apiLocation.id,
              businessName: apiLocation.name || apiLocation.businessName,
              city: apiLocation.city,
              address: apiLocation.address,
              category: apiLocation.category,
            }
          : selectedLocation
            ? {
                id: selectedLocation._id || selectedLocation.id,
                businessName:
                  selectedLocation.name || selectedLocation.businessName,
                city: selectedLocation.city,
                address: selectedLocation.address,
                category: selectedLocation.category,
              }
            : null,
      };

      sessionStorage.setItem("gbpPostPreview", JSON.stringify(postData));

      router.push("/posts/preview");
    } catch (error) {
      setSubmitError(
        error.message || "Unable to create post. Please try again.",
      );
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handlePreview} className="space-y-6">
      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">{submitError}</p>
        </div>
      )}
      {/* Business Location */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Business Location
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select the Google Business Profile location this post belongs to.
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
              : "Select a business location"
          }
          error={errors.locationId || locationsError}
          required
          disabled={locationsLoading || saving}
        />

        {!locationsLoading && locations.length === 0 && !locationsError && (
          <p className="mt-2 text-sm text-slate-500">
            No locations found. Add a business location first.
          </p>
        )}
      </div>

      {/* Post Details */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Post Details</h2>

          <p className="mt-1 text-sm text-slate-500">
            Provide the information that will be used to create your GBP post.
          </p>
        </div>

        <div className="space-y-5">
          <Input
            label="Post Topic"
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder="Example: Free dental checkup camp this weekend"
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
            Choose the action you want customers to take.
          </p>
        </div>

        <CTASelector
          value={formData.cta}
          onChange={handleCTAChange}
          error={errors.cta}
        />
      </div>

      {/* Form Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={saving}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={saving || locationsLoading}>
          {saving ? "Creating post..." : "Preview Post"}
        </Button>
      </div>
    </form>
  );
}
