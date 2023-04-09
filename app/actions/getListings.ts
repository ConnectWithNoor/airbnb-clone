import prismaClient from "../libs/prismadb";

export default async function getListings() {
  try {
    const listings = prismaClient.listing.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return listings;
  } catch (error: any) {
    throw new Error(error);
  }
}
