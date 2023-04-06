import { categories } from "@/app/utils/constants";
import Container from "../container/Container";
import CategoryBox from "./CategoryBox";

function Categories() {
  return (
    <Container>
      <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
        {categories.map((category) => (
          <CategoryBox
            key={category.label}
            label={category.label}
            description={category.description}
            icon={category.icon}
          />
        ))}
      </div>
    </Container>
  );
}

export default Categories;
