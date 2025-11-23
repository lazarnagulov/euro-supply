import React from "react";
import type { Category } from "../../../types/product.types";

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center justify-center">
      <h2 className="text-lg font-medium text-gray-800">{category.name}</h2>
    </div>
  );
};
