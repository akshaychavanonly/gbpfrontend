"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { useAuth } from "@/context/AuthContext";
import { generateAIContent } from "@/services/aiService";

export default function AIContentGenerator({
  locationId,
  topic,
  tone,
  language,
  postType,
  content,
  onContentChange,
}) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setError("");

    if (!topic || !topic.trim()) {
      setError("Please enter a post topic before generating content.");
      return;
    }

    if (!tone || !language || !postType) {
      setError(
        "Please select post type, tone, and language before generating content.",
      );
      return;
    }

    if (!token) {
      setError("Please log in to generate content with AI.");
      return;
    }

    setLoading(true);

    try {
      const data = await generateAIContent(
        {
          locationId,
          topic: topic.trim(),
          postType,
          tone,
          language,
        },
        token,
      );

      if (data?.content) {
        onContentChange(data.content);
      } else {
        setError("No content was generated. Please try again.");
      }
    } catch (err) {
      console.error("AI content generation error:", err);
      setError(
        err.message || "Failed to generate AI content. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            AI Content Generator
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Generate a suggested GBP post based on your form details.
          </p>
        </div>

        <Button type="button" onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate with AI"}
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Textarea
        label="Post Content"
        id="content"
        name="content"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Generated content will appear here. You can also write or edit the content manually."
        rows={8}
      />

      <p className="mt-2 text-xs text-slate-400">
        You can edit the generated content before previewing or saving the post.
      </p>
    </div>
  );
}
