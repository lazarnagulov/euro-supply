import apiClient from "../client";
import type { Product, ProductRequest, ProductWithImage } from "../../features/product/types/product.types";

export const productService = {

  getProducts: async (page: number, size: number, /*params: any*/) => {
    // const isSearch = params && Object.keys(params).length !== 0;
    const response = await apiClient.get(
      /*isSearch ? "/products/search" :*/ "/products",
      { params: { page, size, /*...params*/ } }
    );
    return response.data;
  },

  createProduct: async (data: ProductRequest): Promise<ProductWithImage> => {
    const response = await apiClient.post<Product>("/products", data);
    return response.data as ProductWithImage;
  },

  updateProduct: async (id: number, data: ProductRequest): Promise<ProductWithImage> => {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data as ProductWithImage;
  },

  uploadImage: async (id: number, image: File): Promise<void> => {
    const formData = new FormData();
    formData.append("image", image);

    await apiClient.post(
      `/products/${id}/image`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  deleteProduct: async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  }
};
