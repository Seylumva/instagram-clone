"use server";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export async function setMetadata(data: FormData) {
  const username = data.get("username").valueOf();
  const about = data.get("about").valueOf();

  const user = await currentUser();
  await fetch(`https://api.clerk.com/v1/users/${user.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
    body: JSON.stringify({ username }),
  });

  await fetch(`https://api.clerk.com/v1/users/${user.id}/metadata`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
    body: JSON.stringify({
      public_metadata: {
        about,
      },
    }),
  });
  redirect(`/user/${user.username}`);
}
