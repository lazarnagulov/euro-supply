import apiClient from '../client';
import type { Category, CreateCategoryRequest } from "../../types/product.types";

export const productService = {

  createCategory: async (data: CreateCategoryRequest) => {
      const response = await apiClient.post<Category>('/api/v1/categories', data);
      return response.data;
  },

  getAllCategories: async () => {
      const response = await apiClient.get<Category[]>('/api/v1/categories');
      return response.data;
  }
}