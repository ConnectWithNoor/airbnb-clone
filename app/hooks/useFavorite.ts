import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import axiosInstance from "../libs/axiosInstance";

import { SafeUser } from "../types";
import useLoginModal from "./useLoginModal";
import { FAVORITE_LISTING_ENDPOINT } from "../utils/constants";

type Props = {
  listingId?: string;
  currentUser?: SafeUser | null;
};

const useFavorite = ({ currentUser, listingId }: Props) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];

    return list.includes(listingId as string);
  }, [currentUser?.favoriteIds, listingId]);

  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (!currentUser) return loginModal.onOpen();

      try {
        let request;

        if (hasFavorited) {
          request = () =>
            axiosInstance.delete(`${FAVORITE_LISTING_ENDPOINT}/${listingId}`);
        } else {
          request = () =>
            axiosInstance.post(`${FAVORITE_LISTING_ENDPOINT}/${listingId}`);
        }

        await request();
        router.refresh();
        toast.success("Success");
      } catch (error) {
        toast.error("Something went wrong");
      }
    },
    [currentUser, hasFavorited, listingId, loginModal, router]
  );

  return {
    hasFavorited,
    toggleFavorite,
  };
};

export default useFavorite;
