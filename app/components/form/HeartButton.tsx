"use client";

import { SafeUser } from "@/app/types";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

type Props = {
  listingId: string;
  currentUser?: SafeUser | null;
};

function HeartButton({ currentUser, listingId }: Props) {
  const hasFav = false;

  const toggleFav = () => {};
  return (
    <div
      onClick={toggleFav}
      className="relative hover:opacity-80 transition cursor-pointer"
    >
      <AiOutlineHeart
        size={28}
        className="fill-white absolute -top-[2px] -right-[2px]"
      />
      <AiFillHeart
        size={24}
        className={`${hasFav ? "fill-rose-500" : "fill-neutral-500/70"}`}
      />
    </div>
  );
}

export default HeartButton;
