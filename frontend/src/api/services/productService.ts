import apiClient from "../client";
import type { OrderRequest, OrderResponse, Product, ProductRequest, ProductSearchParams, ProductWithImage } from "../../features/product/types/product.types";

export const productService = {

  getProducts: async (page: number, size: number, params: ProductSearchParams) => {
    const isSearch = params && Object.keys(params).length !== 0;
    const response = await apiClient.get(
      isSearch ? "/products/search" : "/products",
      { params: { page, size, ...params } }
    );
    return response.data;
  },

  getAvailableProducts: async (page: number, size: number) => {
    const response = await apiClient.get("/products/available", { params: { page, size } });
    return response.data;
  },

  getProduct: async (id: number) => {
        const response = await  apiClient.get(  
            `/products/${id}`
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
  },

  searchProducts: async (keyword: string, page: number, size: number) => {
    const response = await apiClient.get("/products/on-sale/search", { params: { keyword, page, size } });
    return response.data;
  },

  order: async (request: OrderRequest) => {
    const response = await apiClient.post<OrderResponse>('/products/order', request);
    return response.data;
  }
};
