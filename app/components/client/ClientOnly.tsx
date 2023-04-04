"use client";

import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

function ClientOnly({ children }: Props) {
  const [hasMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}

export default ClientOnly;
