import { deletePost } from "@/app/actions/deletePost";
import { prisma } from "@/db";
import { currentUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type PostPageParams = {
  params: {
    postId: string;
  };
};

export default async function SinglePostPage({ params }: PostPageParams) {
  const user = await currentUser();
  const { postId } = params;
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      images: true,
      author: true,
    },
  });

  if (!post || !user) {
    notFound();
  }

  return (
    <div className="align-start mx-auto flex h-[900px] max-w-[1200px] flex-col border border-zinc-700 md:flex-row md:justify-between">
      <div className="relative h-1/3 w-full md:h-full md:w-2/3">
        {!post.images.length ? (
          "Broken image"
        ) : (
          <Image
            className="object-contain object-center md:object-contain"
            src={post.images[0].imageUrl}
            alt=""
            fill
            priority
          />
        )}
      </div>
      <div className="border-bottom flex w-full flex-grow flex-col justify-start border-t border-zinc-700 md:w-1/3 md:border-l md:border-t-0">
        <div className="flex items-center border-b border-zinc-700 p-6">
          <Link
            href={`/user/${post.author.username}`}
            className="flex items-center gap-2 pr-2 lowercase text-gray-100 transition hover:text-gray-300"
          >
            <Image
              src={post.author.profileImageUrl}
              alt={post.author.username}
              width={35}
              height={35}
              className="rounded-full"
              priority
            />
            {post.author.username} ·
          </Link>
          {user.id === post.author.externalId ? (
            <form>
              <button
                className="text-sm  text-red-500"
                formAction={async () => {
                  "use server";
                  await deletePost(post.id);
                  redirect(`/user/${post.author.username}`);
                }}
              >
                Delete
              </button>
            </form>
          ) : (
            <button
              type="button"
              className="text-sm font-semibold text-blue-400"
            >
              Follow
            </button>
          )}
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
