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
    <div className="align-start mx-auto flex h-[900px] max-w-[1200px] flex-col border border-zinc-700 md:flex-row md:justify-between">
      <div className="relative h-1/3 w-full md:h-full md:w-2/3">
        <Image
          className="object-contain object-center md:object-contain"
          src={post.images[0].imageUrl}
          alt=""
          fill
        />
      </div>
      <div className="border-bottom flex w-full flex-grow flex-col justify-start border-t border-zinc-700 md:w-1/3 md:border-l md:border-t-0">
        <div className="flex items-center border-b border-zinc-700 p-6">
          <Link
            href={`/user/${post.author.displayName}`}
            className=" lowercase text-gray-100 transition hover:text-gray-300"
          >
            {post.author.displayName} ·
          </Link>
          <button
            type="button"
            className="pl-2 text-sm font-semibold text-blue-400"
          >
            Follow
          </button>
        </div>
        <div className="mt-auto flex w-full flex-col justify-start gap-3 border-t border-zinc-700 p-6">
          <span className="break-words text-sm">{post.caption}</span>
          <p className="text-xs font-extralight">
            {formatDistanceToNow(post.createdAt, {
              addSuffix: true,
              includeSeconds: true,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
