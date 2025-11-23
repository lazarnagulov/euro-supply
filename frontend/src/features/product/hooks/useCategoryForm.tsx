import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Category } from "../../../types/product.types";
import { productService } from "../../../api/services/productService";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .nonempty("Category name is required"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export const useCategoryForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
    mode: "onChange",
  });

  const submitCategory = async (
    data: CategoryFormData
  ): Promise<{ success: boolean; data?: Category; error?: string }> => {
    try {
      const result = await productService.createCategory(data);
      reset();
      return { success: true, data: result };
    } catch (error: any) {
      console.error("Failed to create category:", error);
      return {
        success: false,
        error: error?.message || "Failed to create category",
      };
    }
  };

  return {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    errors,
    isSubmitting,
    submitCategory,
  };
};
