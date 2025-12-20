import { useState } from "react";
import type { CreateProductRequest, Product } from "../types/product.types";
import { productService } from "../../../api/services/productService";

type SubmitStatus = "idle" | "loading" | "success" | "error";

export const useProductSubmit = () => {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const submitProduct = async (
    data: CreateProductRequest,
    image: File
  ): Promise<Product> => {
    setStatus("loading");
    setError(null);

    try {
      const product = await productService.createProduct(data);

      if (image) {
        await productService.uploadImage(product.id, image);
      }

      setStatus("success");
      return product;
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Failed to create product");
      throw err;
    }
  };

  return {
    submitProduct,
    isLoading: status === "loading",
    isSuccess: status === "success",
    isError: status === "error",
    error,
  };
};
