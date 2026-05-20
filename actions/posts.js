"use server"
import { uploadImage } from "@/lib/cloudinary";
import { storePost, updatePostLikeStatus } from "@/lib/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(prevState, formData) {
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

    let imageUrl = '';
    try {
        imageUrl = await uploadImage(image);
    } catch (error) {
        throw new Error('Image upload failed: ' + error.message);
    }

    await storePost({
        title,
        imageUrl,
        content,
        userId: 1
    });
    revalidatePath('/', 'layout');
    redirect('/feed');
}

export async function togglePostLikeStatus(postId) {
    await updatePostLikeStatus(postId, 2);
    revalidatePath('/', 'layout');
}