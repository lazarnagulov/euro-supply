import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle, Upload, X } from "lucide-react";

import type {
  CreateProductRequest,
  ProductWithImage,
} from "../types/product.types";
import type { Category } from "../types/category.types";

import { productSchema } from "../schemas/productSchema";
import { productService } from "../../../api/services/productService";
import { categoryService } from "../../../api/services/categoryService";

interface ProductModalProps {
  mode: "create" | "edit";
  product: ProductWithImage | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  mode,
  product,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProductRequest>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      weight: 0,
      onSale: false,
      categoryId: 0,
    },
    mode: "onChange",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  /* -------------------- INIT -------------------- */
  useEffect(() => {
    const init = async () => {
      const data = await categoryService.getCategories();
      setCategories(data);

      if (product && mode === "edit") {
        reset({
          name: product.name,
          description: product.description,
          price: product.price,
          weight: product.weight,
          onSale: product.onSale,
          categoryId: product.categoryId,
        });
      }
    };

    init();
  }, [product, mode, reset]);

  /* -------------------- IMAGE -------------------- */
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
    setImageError(null);
  };

  const removeImage = () => setImage(null);

  /* -------------------- SUBMIT -------------------- */
  const onSubmit = async (data: CreateProductRequest) => {
    if (mode === "create" && !image) {
      setImageError("Product image is required");
      return;
    }

    setLoading(true);
    setSubmitStatus(null);
    setSubmitError(null);

    try {
      let saved: ProductWithImage;

      if (mode === "create") {
        saved = await productService.createProduct(data);
        if (image) await productService.uploadImage(saved.id, image);
      } else {
        saved = await productService.updateProduct(product!.id, data);
        if (image) await productService.uploadImage(product!.id, image);
      }

      setSubmitStatus("success");
      onSuccess();
    } catch (err: any) {
      setSubmitStatus("error");
      setSubmitError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-100 hover:scrollbar-thumb-indigo-500">
        {/* HEADER */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                {mode === "create" ? "Add New Product" : "Edit Product"}
              </h2>
              <p className="text-indigo-100">
                {mode === "create"
                  ? "Create a new product"
                  : "Update product information"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">
          {submitStatus === "success" && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800">
                Product {mode === "create" ? "created" : "updated"}{" "}
                successfully!
              </p>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">
                Failed to {mode === "create" ? "create" : "update"} product.{" "}
                {submitError}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* NAME */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                {...register("name")}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>

            {/* WEIGHT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("weight", { valueAsNumber: true })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  errors.weight ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>

            {/* CATEGORY */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register("categoryId", { valueAsNumber: true })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  errors.categoryId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value={0}>Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DESCRIPTION */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>

            {/* IMAGE */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image {mode === "create" && "*"}
              </label>

              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
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
                <label htmlFor="product-image" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">
                    Click to upload product image
                  </p>
                </label>
              </div>

              {image && (
                <div className="mt-4 relative w-40">
                  <img
                    src={URL.createObjectURL(image)}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {imageError && (
                <p className="mt-2 text-sm text-red-600">{imageError}</p>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 rounded-b-2xl flex justify-end gap-4 z-10">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 border rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            {loading
              ? mode === "create"
                ? "Creating..."
                : "Updating..."
              : mode === "create"
              ? "Create Product"
              : "Update Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
