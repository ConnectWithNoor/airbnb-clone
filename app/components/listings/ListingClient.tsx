"use client";

import { SafeListing_SafeUser, SafeUser } from "@/app/types";
import { RESERVATIONS_ENDPOINT, categories } from "@/app/utils/constants";
import { Reservation } from "@prisma/client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Container from "../container/Container";
import ListingHead from "./ListingHead";
import ListingInfo from "./ListingInfo";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import axiosInstance from "@/app/libs/axiosInstance";
import { toast } from "react-hot-toast";
import ListingReservation from "./ListingReservation";
import { Range } from "react-date-range";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

type Props = {
  reservation?: Reservation[];
  listing: SafeListing_SafeUser;
  currentUser?: SafeUser | null;
};

function ListingClient({ currentUser, listing, reservation = [] }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  const loginModal = useLoginModal();
  const router = useRouter();

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const daysCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );

      if (daysCount && listing.price) {
        setTotalPrice(daysCount * listing.price);
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange.startDate, dateRange.endDate, listing.price]);

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    reservation.forEach((reserve) => {
      const range = eachDayOfInterval({
        start: new Date(reserve.startDate),
        end: new Date(reserve.endDate),
      });
      dates = [...dates, ...range];
    });

    return dates;
  }, [reservation]);

  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category);
  }, [listing.category]);

  const onCreateReservation = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    try {
      setIsLoading(true);

      await axiosInstance.post(RESERVATIONS_ENDPOINT, {
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        listingId: listing.id,
      });

      toast.success("Listing reserved!");
      setDateRange(initialDateRange);
      // redirect to /trips
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }, [
    currentUser,
    loginModal,
    dateRange.endDate,
    dateRange.startDate,
    totalPrice,
    listing.id,
  ]);

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
          <div
            className="grid 
              grid-cols-1 
              md:grid-cols-7 
              md:gap-10 
              mt-6"
          >
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default ListingClient;
