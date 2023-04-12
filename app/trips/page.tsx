import getCurrentUser from "../actions/getCurrentUser";
import { ClientOnly, EmptyState, TripsClient } from "../components";
import getReservations from "../hooks/getReservations";

async function TripsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subTitle="Please login" />
      </ClientOnly>
    );
  }

  const reservations = await getReservations({
    userId: currentUser?.id,
  });

  if (reservations.length <= 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No trips found"
          subTitle="Looks like you haven't reserved any trips"
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <TripsClient reservations={reservations} currentUser={currentUser} />
    </ClientOnly>
  );
}

export default TripsPage;
