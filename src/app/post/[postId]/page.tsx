import { prisma } from "@/db";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import locale from "date-fns/locale/en-US";

const formatDistanceLocale = {
  lessThanXSeconds: "{{count}}s",
  xSeconds: "{{count}}s",
  halfAMinute: "30s",
  lessThanXMinutes: "{{count}}m",
  xMinutes: "{{count}}m",
  aboutXHours: "{{count}}h",
  xHours: "{{count}}h",
  xDays: "{{count}}d",
  aboutXWeeks: "{{count}}w",
  xWeeks: "{{count}}w",
  aboutXMonths: "{{count}}m",
  xMonths: "{{count}}m",
  aboutXYears: "{{count}}y",
  xYears: "{{count}}y",
  overXYears: "{{count}}y",
  almostXYears: "{{count}}y",
};

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
    <div className="align-start flex h-[900px] justify-between gap-6">
      <div className="relative w-1/2">
        <Image
          src={post.images[0].imageUrl}
          alt=""
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="flex w-1/2 flex-col justify-center p-6 ">
        <div>
          <Link
            href={`/user/${post.author.displayName}`}
            className="font-bold lowercase"
          >
            {post.author.displayName}
          </Link>
          <span className="pl-2 text-sm">{post.caption}</span>
        </div>
        <p className="text-xs font-light">
          {formatDistanceToNow(post.createdAt, {
            addSuffix: true,
            includeSeconds: true,
          })}
        </p>
      </div>
    </div>
  );
}
