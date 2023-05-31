import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/db";

cloudinary.config({
  cloud_name: "seylumva",
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: false,
});

export async function POST(request: Request) {
  const { caption, author } = await request.json();
  const newPost = await prisma.post.create({
    data: { caption, author },
  });
  return NextResponse.json(newPost);
}
