import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  UserButton,
  currentUser,
} from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Link from "next/link";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Instagram Clone",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* @ts-expect-error Server Component */}
          <AppHeader />
          <main className="container mx-auto px-4 py-10 md:px-0">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}

async function AppHeader() {
  const user = await currentUser();

  return (
    <header className="container mx-auto flex items-center justify-between px-4 py-5 md:px-0">
      <Link href="/">Instagram Clone</Link>
      <nav>
        <ul className="flex items-center gap-5">
          <SignedIn>
            <Link href="/create">Create</Link>
            <Link href={`/user/${user.username}`}>{user && user.username}</Link>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link href="/">Home</Link>
            <SignInButton
              mode="modal"
              afterSignInUrl={user && `/user/${user.username}`}
            />
          </SignedOut>
        </ul>
      </nav>
    </header>
  );
}
