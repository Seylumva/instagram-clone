import { prisma } from "@/db";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";

export default async function UserProfile({ params }) {
  const user = await currentUser();
  const profile = await prisma.user.findUnique({
    where: { displayName: params.displayName },
  });
  return (
    <>
      <div className="flex justify-center items-start gap-24">
        <Image
          className="rounded-full"
          src="/defaultpfp.jpg"
          alt={profile.displayName}
          width={150}
          height={150}
        />
        <div className="flex flex-col gap-6">
          <div className="flex gap-8 items-center">
            <span className="text-lg">{profile.displayName}</span>
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
