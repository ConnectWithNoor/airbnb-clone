import prismaClient from "../libs/prismadb";
import { ListingParams } from "../types";

export default async function getListings({ userId }: ListingParams) {
  try {
    let query: any = {};

    if (userId) {
      query.userId = userId;
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
