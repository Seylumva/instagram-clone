"use server";

import { prisma } from "@/db";
import * as cloudinary from "cloudinary";

export async function deletePost(postId: string) {
  try {
    const images = await prisma.image.findMany({
      where: {
        postId,
      },
    });

    if (!images) {
      throw new Error("Unable to find images to delete.");
    }

    const imagePublicIds = images.map((image) => image.publicId);

    const deleteResponse = await cloudinary.v2.api.delete_resources(
      imagePublicIds
    );

    console.log(deleteResponse);

    await prisma.post.delete({ where: { id: postId } });
  } catch (e: any) {
    e.error ? console.log(e.error.message) : console.log(e);
  }
}
