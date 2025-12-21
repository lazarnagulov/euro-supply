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
    categoryId: number
}

export interface ProductRequest {
    name: string;
    description: string;
    price: number;
    weight: number;
    onSale: boolean;
    categoryId: number;
    category?: Category;
}

export interface ProductWithImage extends Product {
    imageUrl: StoredFile;
}