import React from "react";
import { useNavigate } from "react-router-dom";
import { ProductForm } from "../components/ProductForm";
import type { Product } from "../types/product.types";

export const ProductCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (product: Product) => {
    console.log("Product created successfully:", product);

    // TODO: Redirect to product details page
    // navigate(`/products/${product.id}`);

    navigate("/products");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <ProductForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};
