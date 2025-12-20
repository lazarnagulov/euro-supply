import React, { useState } from "react";
import {
  Upload,
  X,
  Package,
  ImagePlus,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import { useProductForm } from "../hooks/useProductForm";
import { useProductSubmit } from "../hooks/useProductSubmit";
import type { CreateProductRequest, Product } from "../types/product.types";

interface ProductFormProps {
  onSuccess?: (product: Product) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    errors,
    categories,
    isLoadingCategories,
    reset,
  } = useProductForm();

  const {
    submitProduct,
    isLoading,
    isSuccess,
    isError,
    error: submitError,
  } = useProductSubmit();

  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | undefined>();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Only image files are allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setImageError("Image must be less than 10MB");
      return;
    }

    setImage(file);
    setImageError(undefined);
  };

  const removeImage = () => {
    setImage(null);
  };

  const onSubmit = async (data: any) => {
    if (!image) {
      setImageError("Please upload a product image");
      return;
    }

    const productData: CreateProductRequest = {
      name: data.name,
      description: data.description,
      price: data.price,
      weight: data.weight,
      onSale: data.onSale,
      categoryId: Number(data.categoryId),
    };

    try {
      const product = await submitProduct(productData, image);
      reset();
      setImage(null);

      if (onSuccess) {
        onSuccess(product);
      }
    } catch {
      // handled in hook
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-800">Create Product</h1>
      </div>

      {isSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-800">Product created successfully!</p>
        </div>
      )}

      {isError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">
            {submitError || "Failed to create product"}
          </p>
        </div>
      )}

      <div className="space-y-8">
        {/* BASIC INFO */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Name *
              </label>
              <input
                type="text"
                {...register("name")}
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Category *
              </label>
              <select
                {...register("categoryId", { valueAsNumber: true })}
                disabled={isLoadingCategories}
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.categoryId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-2">Price *</label>
              <input
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Weight + On Sale */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("weight", { valueAsNumber: true })}
                  className={`w-full px-4 py-2 border rounded-lg ${
                    errors.weight ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.weight && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.weight.message}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  {...register("onSale")}
                  id="onSale"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="onSale"
                  className="text-sm font-medium text-gray-700"
                >
                  On Sale
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* DESCRIPTION */}
        <section>
          <label className="block text-sm font-medium mb-2">
            Description *
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </section>

        {/* IMAGE */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <ImagePlus className="w-5 h-5" />
            Product Image *
          </h2>

          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center relative ${
              imageError ? "border-red-500" : "border-gray-300"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="product-image"
            />

            {image ? (
              // Show large preview if image is selected
              <div className="relative w-full h-64">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Product preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
                <label
                  htmlFor="product-image"
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded cursor-pointer text-sm"
                >
                  Replace Image
                </label>
              </div>
            ) : (
              <label
                htmlFor="product-image"
                className="cursor-pointer flex flex-col items-center justify-center h-64"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload one image
                </p>
              </label>
            )}
          </div>

          {imageError && (
            <p className="mt-2 text-sm text-red-600">{imageError}</p>
          )}
        </section>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400 flex items-center gap-2"
          >
            {isLoading ? "Saving..." : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
};
