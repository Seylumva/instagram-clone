import { IncomingHttpHeaders } from "http";
import { WebhookRequiredHeaders, Webhook } from "svix";
import { prisma } from "@/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

const webhookSecret: string = process.env.WEBHOOK_SECRET || "";

export async function POST(req: Request) {
  const payload = await req.json();
  const headersList = headers();
  const svixHeaders = {
    "svix-id": headersList.get("svix-id"),
    "svix-timestamp": headersList.get("svix-timestamp"),
    "svix-signature": headersList.get("svix-signature"),
  };

  const wh = new Webhook(webhookSecret);
  let evt: Event | null = null;

  try {
    evt = wh.verify(
      JSON.stringify(payload),
      svixHeaders as IncomingHttpHeaders & WebhookRequiredHeaders
    ) as Event;
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json({}, { status: 400 });
  }
  const eventType: EventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, public_metadata, username, image_url } = evt.data;
    try {
      await prisma.user.upsert({
        where: { externalId: id as string },
        create: {
          externalId: id as string,
          username: username as string,
          profileImageUrl: image_url as string,
        },
        update: {
          username: username as string,
          profileImageUrl: image_url as string,
          about: (public_metadata as any).about
            ? (public_metadata as any).about
            : null,
        },
      });
      console.log(`Entry written to with the ID of ${id}`);
    } catch (error) {
      console.log(error);
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    try {
      await prisma.user.delete({
        where: {
          externalId: id as string,
        },
      });
      console.log(`Entry deleted with the ID of ${id}}`);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        if (error.code === "P2025")
          console.log("Record to be deleted does not exist inside database.");
    }
  }
  return NextResponse.json({}, { status: 200 });
}

type Event = {
  data: Record<string, string | number>;
  object: "event";
  type: EventType;
};

type EventType = "user.created" | "user.updated" | "user.deleted" | "*";
