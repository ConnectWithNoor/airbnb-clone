"use client";

import { SafeListing_SafeUser, SafeUser } from "@/app/types";
import { categories } from "@/app/utils/constants";
import { Reservation } from "@prisma/client";
import React, { useMemo } from "react";
import Container from "../container/Container";
import ListingHead from "./ListingHead";
import ListingInfo from "./ListingInfo";

type Props = {
  reservation?: Reservation[];
  listing: SafeListing_SafeUser;
  currentUser?: SafeUser | null;
};

function ListingClient({ currentUser, listing }: Props) {
  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category);
  }, [listing.category]);

  return (
    <Container>
      <div className="max-w-screen-lg max-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            id={listing.id}
            currentUser={currentUser}
          />
          <div className="grid grid-col-1 md:grid-col-7 md:gap-10 mt-6">
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

export default ListingClient;
