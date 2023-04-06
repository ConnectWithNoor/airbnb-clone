"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import qs from "query-string";

import type { IconType } from "react-icons";

type Props = {
  label: String;
  description: String;
  icon: IconType;
  selected?: boolean;
};

function CategoryBox({ label, description, icon: Icon, selected }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = useCallback(() => {
    let currentQuery = {};

    // check params exists
    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    // add category in the queryparams
    const updatedQuery: any = {
      ...currentQuery,
      category: label,
    };

    // if clicked on same query param label again, remove it.
    if (params?.get("category") === label) {
      delete updatedQuery["category"];
    }

    // make url out of queryparams
    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [label, router, params]);

  return (
    <div
      onClick={handleClick}
      className={`
    flex flex-col items-center justi gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer
    ${
      selected
        ? "border-b-neutral-800 text-neutral-800"
        : "border-transparent text-neutral-500"
    }   
    `}
    >
      <Icon size={26} />
      <div className="font-medium text-sm">{label}</div>
    </div>
  );
}

export default CategoryBox;
