"use client";

import axiosInstance from "@/app/libs/axiosInstance";
import { SafeReservation, SafeUser } from "@/app/types";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import Heading from "../typography/Heading";
import Container from "../container/Container";
import ListingCard from "../listings/ListingCard";
import { RESERVATIONS_ENDPOINT } from "@/app/utils/constants";

type Props = {
  reservations: SafeReservation[];
  currentUser?: SafeUser | null;
};

function ReservationsClient({ reservations, currentUser }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");

  const onCancel = useCallback(
    async (id: string) => {
      setDeletingId(id);

      try {
        await axiosInstance.delete(`${RESERVATIONS_ENDPOINT}/${id}`);

        toast.success("Reservation Cancelled");
        router.refresh();
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setDeletingId("");
      }
    },
    [router]
  );

  return (
    <Container>
      <Heading title="Reservations" subtitle="Bookings on your properties" />

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {reservations.map((reservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            actionLabel="Cancel guest reservation"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
}

export default ReservationsClient;
