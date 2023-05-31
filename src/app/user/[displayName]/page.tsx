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
      posts: true,
    },
  });
  return (
    <>
      {/* Profile Details */}
      <div className="flex justify-center items-start gap-10 md:gap-24">
        <Image
          className="rounded-full"
          src="/defaultpfp.jpg"
          alt={profile.displayName}
          width={150}
          height={150}
        />
        <div className="flex flex-col gap-6">
          <div className="flex gap-8 items-center">
            <span className="text-md md:text-lg">{profile.displayName}</span>
            {user.id === profile.id ? <EditProfileButton /> : null}
          </div>
          <div className="flex gap-12 items-center text-sm">
            <span>0 posts</span>
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
    <button className="px-6 py-2 bg-gray-100 text-black font-semibold rounded-lg text-sm hover:bg-gray-300 transition-all">
      Edit Profile
    </button>
  );
}

function ProfilePostGallery({ posts }) {
  return (
    <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  xl:grid-cols-5 gap-5">
      {/* TODO: Implement styles and post functionality */}
      {posts.map((post) => (
        <div key={post.id} className="aspect-square bg-slate-600">
          {post.caption}
        </div>
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
            className="text-blue-500 hover:text-slate-100 text-sm font-semibold"
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
