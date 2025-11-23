import { useState } from "react";
import type {
  Category,
  CreateCategoryRequest,
} from "../../../types/product.types";
import { productService } from "../../../api/services/productService";

type SubmitStatus = "idle" | "loading" | "success" | "error";

interface SubmitResult {
  success: boolean;
  data?: Category;
  error?: string;
}

export const useCategorySubmit = () => {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const submitCategory = async (
    formData: CreateCategoryRequest
  ): Promise<SubmitResult> => {
    setStatus("loading");
    setError(null);

    try {
      const category = await productService.createCategory(formData);

      setStatus("success");

      return {
        success: true,
        data: category,
      };
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to create category";

      setStatus("error");
      setError(errorMessage);

      console.error("Category submission error:", err);

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const resetStatus = () => {
    setStatus("idle");
    setError(null);
  };

  return {
    status,
    isLoading: status === "loading",
    isSuccess: status === "success",
    isError: status === "error",
    error,
    submitCategory,
    resetStatus,
  };
};
