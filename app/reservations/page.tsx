import getCurrentUser from "../actions/getCurrentUser";
import { ClientOnly, EmptyState, ReservationsClient } from "../components";
import getReservations from "../hooks/getReservations";

async function ReservationPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subTitle="Please login" />
      </ClientOnly>
    );
  }
  // want all reservations that others have made on our property.
  const reservations = await getReservations({ authorId: currentUser?.id });

  if (reservations.length <= 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No reservations found"
          subTitle="Looks like you have no reservations on your property"
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ReservationsClient
        reservations={reservations}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
}

export default ReservationPage;
