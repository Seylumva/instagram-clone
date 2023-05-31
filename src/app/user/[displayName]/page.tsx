import { prisma } from "@/db";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

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
  const profile: UserProfile = await prisma.user.findUnique({
    where: { displayName: params.displayName },
    include: {
      posts: {
        include: {
          images: true,
        },
      },
    },
  });
  return (
    <>
      {/* Profile Details */}
      <div className="flex items-start justify-center gap-10 md:gap-24">
        <Image
          className="rounded-full"
          src="/defaultpfp.jpg"
          alt={profile.displayName}
          width={150}
          height={150}
        />
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-8">
            <span className="text-md md:text-lg">{profile.displayName}</span>
            {user.id === profile.id ? <EditProfileButton /> : null}
          </div>
          <div className="flex items-center gap-12 text-sm">
            <span>{profile.posts.length} posts</span>
            <span>0 followers</span>
            <span>0 following</span>
          </div>
          <span>{profile.about}</span>
        </div>
      </div>
      {/* Profile Posts */}
      {profile.posts.length ? (
        <ProfilePostGallery posts={profile.posts} />
      ) : (
        <NoPosts isCurrentUser={user.id === profile.id} />
      )}
    </>
  );
}

function EditProfileButton() {
  return (
    <button className="rounded-lg bg-gray-100 px-6 py-2 text-sm font-semibold text-black transition-all hover:bg-gray-300">
      Edit Profile
    </button>
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
            src={post.images[0].imageUrl}
            alt=""
            fill
            style={{ objectFit: "cover" }}
          />
        </Link>
      ))}
    </div>
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
