import type { StoredFile } from "../../../types/file.types";
import type { Category } from "./category.types";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: Category;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductRequest {
    name: string;
    description: string;
    price: number;
    weight: number;
    onSale: boolean;
    categoryId: number;
}

export interface ProductWithImage extends Product {
    image: StoredFile;
}