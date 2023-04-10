"use client";

import { SafeReservation, SafeUser } from "@/app/types";
import Container from "../container/Container";
import Heading from "../typography/Heading";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import axiosInstance from "@/app/libs/axiosInstance";
import { RESERVATIONS_ENDPOINT } from "@/app/utils/constants";
import { toast } from "react-hot-toast";
import ListingCard from "../listings/ListingCard";

type Props = {
  reservations: SafeReservation[];
  currentUser?: SafeUser | null;
};

function TripsClient({ currentUser, reservations }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");

  const onCancel = useCallback(
    async (id: string) => {
      setDeletingId(id);

      try {
        await axiosInstance.delete(`${RESERVATIONS_ENDPOINT}/${id}`);
        toast.success("Reservation Canenlled");
        router.refresh();
      } catch (error: any) {
        toast.error(error?.response?.data?.error || "Something went wrong");
      } finally {
        setDeletingId("");
      }
    },
    [router]
  );

  return (
    <Container>
      <Heading
        title="Trips"
        subtitle="Where you've been and where you're going"
      />
      <div
        className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8
      "
      >
        {reservations.map((reservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            actionLabel="Cancel reservation"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
}

export default TripsClient;
