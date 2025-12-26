import apiClient from '../client';
import type { Category } from "../../features/product/types/category.types";

export const categoryService = {

  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  }
};