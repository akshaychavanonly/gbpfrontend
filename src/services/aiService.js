const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "gbpbackend-production-618a.up.railway.app/api";

/*
 * Generate GBP post content with AI.
 *
 * IMPORTANT:
 * The frontend should call your Node.js backend.
 *
 * The backend will then call OpenRouter.
 *
 * Never put the OpenRouter API key here.
 */
export async function generateAIContent(formData, token) {
  const response = await fetch(`${API_BASE_URL}/ai/generate`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      locationId: formData.locationId,
      topic: formData.topic,
      postType: formData.postType,
      tone: formData.tone,
      language: formData.language,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "AI content generation failed.");
  }

  return data;
}
