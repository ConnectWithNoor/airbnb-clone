"use client";

import { SafeListing, SafeUser } from "@/app/types";
import Container from "../container/Container";
import Heading from "../typography/Heading";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import axiosInstance from "@/app/libs/axiosInstance";
import {
  LISTING_ADD_ENDPOINT,
  RESERVATIONS_ENDPOINT,
} from "@/app/utils/constants";
import { toast } from "react-hot-toast";
import ListingCard from "../listings/ListingCard";

type Props = {
  listings: SafeListing[];
  currentUser?: SafeUser | null;
};

function PropertiesClient({ currentUser, listings }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");

  const onCancel = useCallback(
    async (id: string) => {
      setDeletingId(id);

      try {
        await axiosInstance.delete(`${LISTING_ADD_ENDPOINT}/${id}`);
        toast.success("Listing Deleted");
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
      <Heading title="Properties" subtitle="List of your properties" />
      <div
        className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8
      "
      >
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            data={listing}
            actionId={listing.id}
            onAction={onCancel}
            disabled={deletingId === listing.id}
            actionLabel="Delete Property"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
}

export default PropertiesClient;
