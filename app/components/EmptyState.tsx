"use client";

import { useRouter } from "next/navigation";
import Heading from "./typography/Heading";
import Button from "./form/Button";

type Props = {
  title?: string;
  subTitle?: string;
  showReset?: boolean;
};

function EmptyState({
  title = "No exact matches",
  subTitle = "Try changing or removing some of your filter",
  showReset,
}: Props) {
  const router = useRouter();
  return (
    <div className="h-[60vh] flex flex-col gap-2 justify-center items-center">
      <Heading title={title} subtitle={subTitle} center />
      <div className="w-48 mt-4">
        {showReset && (
          <Button
            outline
            label="Remove all filters"
            onClick={() => router.push("/")}
          />
        )}
      </div>
    </div>
  );
}

export default EmptyState;
