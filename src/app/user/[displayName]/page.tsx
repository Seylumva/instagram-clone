import { prisma } from "@/db";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type UserProfile = {
  id: string;
  displayName: string;
  about: string;
  followers?: object[];
  following?: object[];
  posts?: object[];
};

export default async function UserProfile({ params }) {
  const user = await currentUser();
  const profile = await prisma.user.findUnique({
    where: {
      username: params.displayName,
    },
    include: {
      posts: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          images: true,
        },
      },
    },
  });

  if (!profile) {
    notFound();
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-[975px] flex-wrap items-center justify-start gap-6 sm:justify-center sm:gap-4 sm:border-b sm:border-zinc-700 sm:pb-12">
        {/* Image */}
        <div className="relative aspect-square w-24 sm:w-44">
          <Image
            className="rounded-full"
            src={profile.profileImageUrl}
            alt={profile.username}
            fill={true}
            style={{ objectFit: "cover" }}
          />
        </div>
        {/* Name & Button */}
        <div className="flex h-fit grow flex-col items-start gap-4 sm:w-4/6 sm:grow-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2 sm:px-12 sm:pt-4 md:w-3/6">
          <span className="mr-6 text-lg">{profile.username}</span>
          {user.username === profile.username ? (
            <WhiteButton>Edit Profile</WhiteButton>
          ) : (
            <div className="flex gap-2">
              <BlueButton>Follow</BlueButton>
              <WhiteButton>Message</WhiteButton>
            </div>
          )}
          <ul className="mt-4 hidden w-full gap-8 sm:flex">
            <div className="text-slate-300">
              <span className="pr-1 font-bold text-white">
                {profile.posts.length}
              </span>{" "}
              posts
            </div>
            <div className="text-slate-300">
              <span className="pr-1 font-bold text-white">0</span> followers
            </div>
            <div className="text-slate-300">
              <span className="pr-1 font-bold text-white">0</span> following
            </div>
          </ul>
          <div className="mt-4 hidden text-sm sm:block">{profile.about}</div>
        </div>
        {/* About */}
        <div className="text-sm sm:hidden">{profile.about}</div>
        {/* Stats */}
        <div className="flex w-full justify-center gap-16 border-y border-zinc-900 py-3 text-sm sm:order-3 sm:hidden">
          <div className="flex flex-col items-center font-light text-slate-300">
            <span className="font-bold text-white">{profile.posts.length}</span>{" "}
            posts
          </div>
          <div className="flex flex-col items-center font-light text-slate-300">
            <span className="font-bold text-white">0</span> followers
          </div>
          <div className="flex flex-col items-center font-light text-slate-300">
            <span className="font-bold text-white">0</span> following
          </div>
        </div>
      </div>
      {/* Profile Posts */}
      {profile.posts.length ? (
        <ProfilePostGallery posts={profile.posts} />
      ) : (
        <NoPosts isCurrentUser={user.username === profile.username} />
      )}
    </>
  );
}

function ProfilePostGallery({ posts }) {
  return (
    <div className="mx-auto mt-16 grid max-w-[975px] grid-cols-2 gap-5 md:grid-cols-3">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/post/${post.id}`}
          className="relative aspect-square"
        >
          <Image
            src={
              post.images.length
                ? post.images[0].imageUrl
                : post.images.imageUrl
            }
            alt=""
            fill
            style={{ objectFit: "cover" }}
            draggable={false}
          />
        </Link>
      ))}
    </div>
  );
}

function WhiteButton({ children }) {
  return (
    <button className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-black transition-all hover:bg-gray-300">
      {children}
    </button>
  );
}

function BlueButton({ children }) {
  return (
    <button className="rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-sky-700">
      {children}
    </button>
  );
}

function NoPosts({ isCurrentUser }) {
  return (
    <div className="mt-32 flex flex-col items-center gap-4">
      {isCurrentUser ? (
        <>
          <h3 className="text-3xl font-black">Share Photos</h3>
          <p className="text-sm font-light">
            When you share photos, they will appear on your profile.
          </p>
          <Link
            href="/create"
            className="text-sm font-semibold text-blue-500 hover:text-slate-100"
          >
            Share your first photo
          </Link>
        </>
      ) : (
        <>
          <h3 className="text-3xl font-black">No photos</h3>
          <p className="text-sm font-light">
            It looks like this user hasn't posted anything yet.
          </p>
        </>
      )}
    </div>
  );
}
