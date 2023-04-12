import getCurrentUser from "@/app/actions/getCurrentUser";
import prismaClient from "@/app/libs/prismadb";
import { stat } from "fs";
import { NextResponse } from "next/server";

type Params = {
  listingId?: string;
};

export async function DELETE(
  request: Request,
  { params: { listingId } }: { params: Params }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Not Allowed" }, { status: 401 });
  }

  if (!listingId || typeof listingId !== "string") {
    return NextResponse.json(
      { error: "Required fields missing" },
      { status: 400 }
    );
  }

  const listing = await prismaClient.listing.deleteMany({
    where: {
      id: listingId,
      userId: currentUser.id,
    },
  });

  return NextResponse.json(listing, { status: 200 });
}
