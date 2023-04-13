"use client";

import { useEffect } from "react";
import { EmptyState } from "./components";

type Props = {
  error: Error;
};

function Error({ error }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return <EmptyState title="Uh no" subTitle="Something went wrong" />;
}

export default Error;
