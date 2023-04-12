import prismaClient from "../libs/prismadb";
import { SafeReservation } from "../types";

type Params = {
  listingId?: string; // query by listing
  userId?: string; // query made by visitor to see all his reservations
  authorId?: string; // query made by owner of property to check all his reservations
};

export default async function getReservations({
  authorId,
  listingId,
  userId,
}: Params) {
  try {
    const query: any = {};
    if (listingId) {
      query.listingId = listingId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (authorId) {
      query.listing = { userId: authorId };
    }

    if (Object.keys(query).length <= 0) {
      return [];
    }

    const reservations = await prismaClient.reservation.findMany({
      where: query,
      include: {
        listing: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeReservations = reservations.map((reservation) => ({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      listing: {
        ...reservation.listing,
        createdAt: reservation.listing.createdAt.toISOString(),
      },
    }));

    return safeReservations;
  } catch (error: any) {
    throw new Error(error);
  }
}
