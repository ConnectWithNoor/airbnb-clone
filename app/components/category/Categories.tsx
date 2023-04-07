"use client";

import { categories } from "@/app/utils/constants";
import Container from "../container/Container";
import CategoryBox from "./CategoryBox";
import { usePathname, useSearchParams } from "next/navigation";

function Categories() {
  const params = useSearchParams();
  const pathname = usePathname();

  const categoryLabel = params?.get("category");
  const isMainPage = pathname === "/";

  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
        {categories.map((category) => (
          <CategoryBox
            key={category.label}
            label={category.label}
            description={category.description}
            icon={category.icon}
            selected={categoryLabel === category.label}
          />
        ))}
      </div>
    </Container>
  );
}

export default Categories;
