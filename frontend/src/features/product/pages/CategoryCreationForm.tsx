import React from "react";
import { useNavigate } from "react-router-dom";
import { CategoryForm } from "../components/CategoryForm";
import { useCategorySubmit } from "../hooks/useCategorySubmit";
import type { Category } from "../../../types/product.types";

export const CategoryCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading, isSuccess, isError, error, submitCategory, resetStatus } =
    useCategorySubmit();

  const handleSuccess = (category: Category) => {
    console.log("Category created successfully:", category);
    navigate("/categories");
  };

  const onSubmit = async (data: { name: string }) => {
    const result = await submitCategory(data);
    if (result.success && result.data) {
      resetStatus();
      handleSuccess(result.data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <CategoryForm
          onSubmitCategory={onSubmit}
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
          errorMessage={error || undefined}
        />
      </div>
    </div>
  );
};
