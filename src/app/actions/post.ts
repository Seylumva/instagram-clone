"use server";
import { prisma } from "@/db";
type FormData = {
  caption: string;
  files: any;
  userId: string;
};

export async function createPost(d: FormData) {
  const user = await prisma.user.findUnique({
    where: {
      externalId: d.userId,
    },
  });

  const newPost = await prisma.post.create({
    data: {
      authorId: user.id,
      caption: d.caption,
    },
  });

  for (let file of d.files) {
    const newImage = await prisma.image.create({
      data: {
        imageUrl: file,
        postId: newPost.id,
      },
    });
  }
}
