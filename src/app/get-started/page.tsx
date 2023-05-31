import { prisma } from "@/db";
import GetStartedForm from "../components/GetStartedForm";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function GetStartedPage() {
  const user = await currentUser();
  const profile = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (profile) {
    redirect(`/user/${profile.displayName}`);
  }

  return (
    <div>
      <GetStartedForm />
    </div>
  );
}
