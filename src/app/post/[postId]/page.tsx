import { prisma } from "@/db";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export default async function SinglePostPage({ params }) {
  const { postId } = params;
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: true,
      images: true,
    },
  });

  return (
    <div className="align-start flex h-[900px] flex-col gap-2 md:flex-row md:justify-between md:gap-4">
      <div className="relative h-1/3 w-full md:h-full md:w-1/2">
        <Image
          src={post.images[0].imageUrl}
          alt=""
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="flex w-full flex-col justify-center p-6 md:w-1/2 ">
        <div>
          <Link
            href={`/user/${post.author.displayName}`}
            className="font-bold lowercase text-gray-100 transition hover:text-gray-300"
          >
            {post.author.displayName}
          </Link>
          <span className="pl-2 text-sm">{post.caption}</span>
        </div>
        <p className="text-xs font-extralight">
          {formatDistanceToNow(post.createdAt, {
            addSuffix: true,
            includeSeconds: true,
          })}
        </p>
      </div>
    </div>
  );
}
