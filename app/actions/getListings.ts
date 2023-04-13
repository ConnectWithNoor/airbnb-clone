import prismaClient from "../libs/prismadb";
import { ListingParams } from "../types";

export default async function getListings({
  userId,
  bathroomCount,
  category,
  endDate,
  guestCount,
  locationValue,
  roomCount,
  startDate,
}: ListingParams) {
  try {
    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (roomCount) {
      query.roomCount = {
        gte: +roomCount,
      };
    }

    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount,
      };
    }

    if (guestCount) {
      query.guestCount = {
        gte: +guestCount,
      };
    }

    if (locationValue) {
      query.locationValue = locationValue;
    }

    if (startDate && endDate) {
      // filter out (NOT) all the listings that have reservation in our interested dates.
      query.NOT = {
        reservations: {
          some: {
            OR: [
              { endDate: { gte: startDate }, startDate: { lte: startDate } },
              { startDate: { lte: endDate }, endDate: { gte: endDate } },
            ],
          },
        },
      };
    }

    const listings = await prismaClient.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toString(),
    }));

    return safeListings;
  } catch (error: any) {
    throw new Error(error);
  }
}
