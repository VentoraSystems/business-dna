import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { db } from "@/lib/db";

interface ClerkUserEvent {
  type: string;
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string | null;
    last_name: string | null;
  };
}

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return new NextResponse("Missing CLERK_WEBHOOK_SECRET", { status: 500 });
  }

  const headerList = await headers();
  const svixId = headerList.get("svix-id");
  const svixTimestamp = headerList.get("svix-timestamp");
  const svixSignature = headerList.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new NextResponse("Missing svix headers", { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(secret);

  let event: ClerkUserEvent;
  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserEvent;
  } catch {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  if (event.type === "user.created") {
    await db.user.upsert({
      where: { clerkId: event.data.id },
      update: {},
      create: {
        clerkId: event.data.id,
        email: event.data.email_addresses[0]?.email_address ?? "",
        firstName: event.data.first_name,
        lastName: event.data.last_name,
      },
    });
  }

  if (event.type === "user.updated") {
    await db.user.updateMany({
      where: { clerkId: event.data.id },
      data: {
        email: event.data.email_addresses[0]?.email_address ?? undefined,
        firstName: event.data.first_name,
        lastName: event.data.last_name,
      },
    });
  }

  if (event.type === "user.deleted") {
    await db.user.deleteMany({ where: { clerkId: event.data.id } });
  }

  return NextResponse.json({ received: true });
}
