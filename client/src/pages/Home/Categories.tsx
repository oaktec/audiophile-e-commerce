import { CATEGORIES } from "@/config/config";
const Categories = () => (
  <div>
    {CATEGORIES.map((category) => (
      <div>{category}</div>
    ))}
  </div>
);

export default Categories;
