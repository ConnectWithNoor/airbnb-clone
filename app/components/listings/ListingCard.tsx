"use client";

import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import { Listing, Reservations } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import Image from "next/image";
import HeartButton from "../form/HeartButton";
import Button from "../form/Button";

type Props = {
  data: Listing;
  currentUser?: SafeUser | null;
  reservation?: Reservations;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
};

function ListingCard({
  currentUser,
  data,
  reservation,
  actionId = "",
  actionLabel,
  disabled,
  onAction,
}: Props) {
  const router = useRouter();
  const { getByValue } = useCountries();

  const location = getByValue(data.locationValue);

  const price = useMemo(() => {
    if (reservation?.totalPrice) {
      return reservation.totalPrice;
    }

    return data.price;
  }, [reservation?.totalPrice, data.price]);

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId);
    },
    [disabled, onAction, actionId]
  );

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [reservation]);

  return (
    <div
      onClick={() => router.push(`/listing/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        {/* image */}
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <Image
            fill
            alt="listing"
            src={data.imageSrc}
            className="object-cover h-full w-full group-hover:scale-110 transition"
          />
          <div className="absolute top-3 right-3">
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
        </div>
        {/* location */}
        <div className="font-semibold text-lg">
          {location?.region}, {location?.label}
        </div>

        {/*  */}

        <div className="font-light text-neutral-500">
          {reservationDate || data.category}
        </div>

        {/* pricing per night */}

        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">${price}</div>
          {!reservation && <div className="font-light"> night</div>}
        </div>

        {/* cancel reservation */}

        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  );
}

export default ListingCard;
