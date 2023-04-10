import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import { ClientOnly, EmptyState } from "@/app/components";
import ListingClient from "@/app/components/listings/ListingClient";

type Props = {
  params: {
    listingId: string;
  };
};

async function ListingPage({ params: { listingId } }: Props) {
  const listing = await getListingById({ listingId });
  const currentUser = await getCurrentUser();

  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ListingClient listing={listing} currentUser={currentUser} />
    </ClientOnly>
  );
}

export default ListingPage;
