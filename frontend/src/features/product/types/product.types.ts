import type { StoredFile } from "../../../types/file.types";
import type { Category } from "./category.types";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    weight: number;
    onSale: boolean;
    category: Category;
    createdAt: string;
    updatedAt: string;
    categoryId: number;
    factoryIds: number[];
    factoryNames: string[];
}

export interface ProductRequest {
    name: string;
    description: string;
    price: number;
    weight: number;
    onSale: boolean;
    categoryId: number;
    category?: Category;
    factoryIds: number[];
}

export interface ProductWithImage extends Product {
    imageUrl: StoredFile;
}

export interface ProductSearchParams {
  name?: string;
  description?: string;
  minPrice?: number;
  maxPrice?: number;
  minWeight?: number;
  maxWeight?: number;
  onSale?: boolean;
  categoryId?: number;
}

export interface OrderRequest {
    companyId: number;
    productId: number;
    quantity: number;
}

export interface OrderResponse {
    id: number;
}