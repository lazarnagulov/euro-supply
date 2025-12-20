import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormData } from "../schemas/productSchema";
import { useEffect, useState } from "react";
import type { Category } from "../types/category.types";
import { categoryService } from "../../../api/services/categoryService";

export const useProductForm = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      weight: 0,
      onSale: false,
      categoryId: 0,
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  return {
    register,
    handleSubmit,
    reset,
    errors,
    categories,
    isLoadingCategories,
  };
};
