import PageHeader from "@/components/layout/PageHeader";
import PostForm from "@/components/posts/PostForm";

export default async function CreatePostPage({ searchParams }) {
  const params = await searchParams;

  const initialLocationId = params?.location || "";

  return (
    <div>
      <PageHeader
        title="Create GBP Post"
        description="Create and generate content for a Google Business Profile post."
      />

      <PostForm initialLocationId={initialLocationId} />
    </div>
  );
}
