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
      <div className="flex items-start justify-center gap-10 md:gap-24">
        <Image
          className="rounded-full"
          src={profile.profileImageUrl}
          alt={profile.username}
          width={150}
          height={150}
        />
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-8">
            <span className="text-md md:text-lg">{profile.username}</span>
            {user.username === profile.username && <EditProfileButton />}
          </div>
          <div className="flex items-center gap-12 text-sm">
            <span>{profile.posts.length} posts</span>
            <span>0 followers</span>
            <span>0 following</span>
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
    <div className="mx-auto mt-16 grid max-w-screen-md grid-cols-2 gap-5 md:grid-cols-3">
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

function EditProfileButton() {
  return (
    <button className="rounded-lg bg-gray-100 px-6 py-2 text-sm font-semibold text-black transition-all hover:bg-gray-300">
      Edit Profile
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
