import { storePost } from "@/lib/posts";
import { redirect } from "next/navigation";
import PostForm from "@/components/post-form";

export default function NewPostPage() {
  async function createPost(prevState, formData) {
    'use server';
    const title = formData.get("title");
    const image = formData.get("image");
    const content = formData.get("content");

    const errors = [];
    if (!title || !title.trim()?.length) {
      errors.push('Title is required');
    }
    if (!content || !content.trim()?.length) {
      errors.push('Content is required');
    }
    if (!image || !image.size) {
      errors.push('Image is required');
    }
    if (errors.length) {
      return { errors };
    }
    await storePost({
      title,
      imageUrl: '',
      content,
      userId: 1
    });

    redirect('/feed');
  }

  return (
    <PostForm action={createPost} />
  );
}
