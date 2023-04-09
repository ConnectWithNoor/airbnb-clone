import getCurrentUser from "@/app/actions/getCurrentUser";
import prismaClient from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

type Params = {
  listingId?: string;
};

export async function POST(req: Request, { params }: { params: Params }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Not Allowed" }, { status: 401 });
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid Id");
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];
  favoriteIds.push(listingId);

  const user = await prismaClient.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds,
    },
  });

  return NextResponse.json(user, { status: 200 });
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Not Allowed" }, { status: 401 });
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid Id");
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  favoriteIds = favoriteIds.filter((favId) => favId !== listingId);

  const user = await prismaClient.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds,
    },
  });

  return NextResponse.json(user, { status: 200 });
}
