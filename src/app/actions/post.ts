"use server";
import { prisma } from "@/db";
import { redirect } from "next/navigation";

export async function createPost(caption: string, userId: string) {
  const profile = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  await prisma.post.create({
    data: {
      authorId: userId,
      caption: caption,
    },
  });

  return profile.displayName;
}
