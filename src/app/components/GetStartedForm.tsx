import { prisma } from "@/db";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function GetStarted() {
  async function createProfile(data: FormData) {
    "use server";
    const user = await currentUser();
    console.log("abc");
    if (!user) {
      throw new Error("You must be signed in to continue.");
    }

    const displayName = data.get("displayName")?.valueOf();
    if (typeof displayName !== "string" || displayName.length === 0) {
      throw new Error("Invalid display name.");
    }
    const profile = await prisma.user.create({
      data: {
        id: user.id,
        displayName,
        about: "",
      },
    });
    redirect(`/user/${profile.displayName}`);
  }

  return (
    <div>
      <form action={createProfile} className="flex flex-col gap-6 w-96 mx-auto">
        <h2>Let's get you started!</h2>

        <div className="flex flex-col gap-3">
          <label htmlFor="displayName">Display Name:</label>
          <input
            className="rounded-md py-3 text-black text-sm px-3"
            type="text"
            name="displayName"
            id="displayName"
          />
        </div>

        <button className="py-3 bg-slate-700 text-slate-100 text-sm hover:bg-slate-800 transition-all rounded-md">
          Create Profile
        </button>
      </form>
    </div>
  );
}
