import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import Heading from "../typography/Heading";
import Image from "next/image";
import HeartButton from "../form/HeartButton";

type Props = {
  title: string;
  imageSrc: string;
  locationValue: string;
  id: string;
  currentUser?: SafeUser | null;
};

function ListingHead({
  locationValue,
  title,
  imageSrc,
  id,
  currentUser,
}: Props) {
  const { getByValue } = useCountries();
  const location = getByValue(locationValue!);

  return (
    <>
      <Heading
        title={title!}
        subtitle={`${location?.region}, ${location?.label}`}
      />

      <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
        <Image
          src={imageSrc!}
          alt="image"
          fill
          className="object-cover w-full"
        />
        <div className="absolute top-5 right-5">
          <HeartButton listingId={id!} currentUser={currentUser} />
        </div>
      </div>
    </>
  );
}

export default ListingHead;
