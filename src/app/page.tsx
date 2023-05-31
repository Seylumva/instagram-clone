import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <SignedIn>
        Look's like you're logged in! Click{" "}
        <Link className="font-semibold" href="/get-started">
          here
        </Link>{" "}
        to get started!
      </SignedIn>
      <SignedOut>
        If you're seeing this it means <b>you are not logged in</b>!
      </SignedOut>
    </>
  );
}
