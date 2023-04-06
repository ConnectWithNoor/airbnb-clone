import Image from "next/image";
import React from "react";

type Props = {
  src: string | null | undefined;
};

function Avatar({ src }: Props) {
  return (
    <Image
      className="rounded-full"
      width="30"
      height="30"
      alt="Avatar"
      src={src || "/images/placeholder.jpg"}
    />
  );
}

export default Avatar;
