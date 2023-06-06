"use server";
import { prisma } from "@/db";
type FormData = {
  caption: string;
  files: any;
  userId: string;
};

export async function createPost(d: FormData) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        externalId: d.userId,
      },
    });

    if (!user) {
      throw new Error("Invalid user.");
    }

    const newPost = await prisma.post.create({
      data: {
        authorId: user.id,
        caption: d.caption,
      },
    });

    if (!newPost) {
      throw new Error("Unable to create post.");
    }

    for (let file of d.files) {
      const newImage = await prisma.image.create({
        data: {
          imageUrl: file.url,
          postId: newPost.id,
          publicId: file.publicId,
        },
      });

      if (!newImage) {
        throw new Error("Unable to upload asset.");
      }
    }
  } catch (error) {
    console.log(error);
  }
}
