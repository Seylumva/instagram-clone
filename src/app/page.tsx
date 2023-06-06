import { SignInButton, currentUser } from "@clerk/nextjs";
import Link from "next/link";

export default async function Home() {
  const user = await currentUser();

  return (
    <>
      <div className="text-center">
        <h1 className="mb-4 text-3xl">Welcome!</h1>
        {user ? (
          <p className="text-sm text-gray-100">
            To see your profile,{" "}
            <Link href={`/user/${user.username}`}>click here.</Link>
          </p>
        ) : (
          <p className="text-sm text-gray-100">
            To get started sharing pictures,{" "}
            <SignInButton mode="modal">click here.</SignInButton>
          </p>
        )}
      </div>
    </>
  );
}
