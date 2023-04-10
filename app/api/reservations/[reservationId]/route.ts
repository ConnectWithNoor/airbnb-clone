import getCurrentUser from "@/app/actions/getCurrentUser";
import prismaClient from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

type Params = {
  reservationId?: string;
};

export async function DELETE(request: Request, { params }: { params: Params }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Not Allowed" }, { status: 401 });
  }

  const { reservationId } = params;

  if (!reservationId || typeof reservationId !== "string") {
    return NextResponse.json(
      { error: "Required fields missing" },
      { status: 400 }
    );
  }

  const reservation = await prismaClient.reservation.deleteMany({
    where: {
      id: reservationId,
      //   delete only if the delete request is made by one of the following
      OR: [
        {
          userId: currentUser.id, // the visitor / user / reserver
        },
        {
          listing: {
            userId: currentUser.id, // the owner of the property / listing
          },
        },
      ],
    },
  });

  return NextResponse.json(reservation, {
    status: 200,
  });
}
