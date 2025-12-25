// hooks/useProductData.ts
import { useEffect, useState } from "react";
import { productService } from "../../../api/services/productService";
import type { ProductWithImage } from "../types/product.types";
import toast from "react-hot-toast";

export const useProductData = (productId: string | undefined) => {
  const [product, setProduct] = useState<ProductWithImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await productService.getProduct(Number(productId));
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product:", error);
        toast.error("Failed to load product details");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  return { product, loading };
};
