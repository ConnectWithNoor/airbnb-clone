import getCurrentUser from "./actions/getCurrentUser";
import getListings from "./actions/getListings";
import { ClientOnly, Container, EmptyState, ListingCard } from "./components";
import { ListingParams } from "./types";

type Props = {
  searchParams: ListingParams;
};

export default async function Home({ searchParams }: Props) {
  const listings = await getListings(searchParams);
  const currentUser = await getCurrentUser();

  if (listings.length <= 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <Container>
        <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              data={listing}
              currentUser={currentUser}
            />
          ))}
        </div>
      </Container>
    </ClientOnly>
  );
}
