"use server";
import { prisma } from "@/db";

type FormData = {
  caption: string;
  files: any;
  userId: string;
};

export async function createPost(formData: FormData) {
  const profile = await prisma.user.findUnique({
    where: { id: formData.userId },
  });

  const newPost = await prisma.post.create({
    data: {
      authorId: profile.id,
      caption: formData.caption,
    },
  });

  for (let file of formData.files) {
    const newImage = await prisma.image.create({
      data: {
        imageUrl: file,
        postId: newPost.id,
      },
    });
  }

  return profile.displayName;
}
