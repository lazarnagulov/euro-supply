import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle, Upload, X } from "lucide-react";
import AsyncSelect from "react-select/async";

import type { ProductRequest, ProductWithImage } from "../types/product.types";
import type { Category } from "../types/category.types";
import { productSchema } from "../schemas/productSchema";
import { productService } from "../../../api/services/productService";
import { categoryService } from "../../../api/services/categoryService";
import { factoryService } from "../../../api/services/factoryService";
import type { FactoryResponse } from "../../factory/types/factory.types";
import AuthenticatedImage from "../../../components/auth/AuthenticatedImage.tsx";

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
    control,
    formState: { errors },
  } = useForm<ProductRequest>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      weight: 0,
      onSale: false,
      categoryId: 0,
      category: undefined,
      factoryIds: [],
    },
    mode: "onChange",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [selectedFactories, setSelectedFactories] = useState<
    { label: string; value: number }[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  /* -------------------- INIT -------------------- */
  useEffect(() => {
    const init = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);

        if (product && mode === "edit") {
          reset({
            name: product.name,
            description: product.description,
            price: product.price,
            weight: product.weight,
            onSale: product.onSale,
            categoryId: product.category?.id || product.categoryId || 0,
            category: product.category,
            factoryIds: product.factoryIds,
          });

          if (product.imageUrl) {
            setPreviewUrl(product.imageUrl.url || null);
          }
          setIsImageChanged(false);
        }
      } catch (error) {
        console.error("Failed to initialize form:", error);
      }
    };
    init();
  }, [product?.id, mode, reset]);

  useEffect(() => {
    if (product && mode === "edit" && product.factoryIds?.length) {
      console.log("Calling getFactoriesByProductId with:", product.id);
      const loadSelectedFactories = async () => {
        const data = await factoryService.getFactoriesByProductId(product.id);
        setSelectedFactories(
          data.map((f: FactoryResponse) => ({ label: f.name, value: f.id })),
        );
      };
      loadSelectedFactories();
    }
  }, [product?.factoryIds, mode]);

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
    setPreviewUrl(URL.createObjectURL(file));
    setIsImageChanged(true);
    setImageError(null);
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
    setIsImageChanged(true);
  };

  /* -------------------- SUBMIT -------------------- */
  const onSubmit = async (data: ProductRequest) => {
    if (mode === "create" && !image) {
      setImageError("Product image is required");
      return;
    }

    setLoading(true);
    setSubmitStatus(null);
    setSubmitError(null);

    try {
      if (mode === "create") {
        const saved = await productService.createProduct(data);

        if (image) {
          await productService.uploadImage(saved.id, image);
        }
      } else if (mode === "edit" && product) {
        const saved = await productService.updateProduct(product.id, data);
        console.log("Product updated:", saved);

        if (isImageChanged && image) {
          console.log("Uploading new image for product...");
          await productService.uploadImage(product.id, image);
        }
      } else {
        console.error("Invalid mode or missing product:", { mode, product });
        throw new Error("Invalid operation");
      }

      setSubmitStatus("success");
      setTimeout(() => {
        onSuccess();
      }, 500);
    } catch (err: any) {
      console.error("Submit error:", err);
      setSubmitStatus("error");
      setSubmitError(err?.message || "Something went wrong");
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

          <form
            id="product-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* NAME */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  {...register("name")}
                  placeholder="e.g., Premium Coffee Beans"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
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
                  placeholder="e.g., 29.99"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.price.message}
                  </p>
                )}
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
                  placeholder="e.g., 0.5"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.weight ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.weight && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.weight.message}
                  </p>
                )}
              </div>
              {/* CATEGORY */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => {
                    return (
                      <select
                        {...field}
                        value={field.value || 0}
                        onChange={(e) => {
                          const newValue = Number(e.target.value);
                          field.onChange(newValue);
                        }}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          errors.categoryId
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <option value={0}>Select category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    );
                  }}
                />
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              {/* ON SALE CHECKBOX */}
              <div className="col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("onSale")}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Product is available
                  </span>
                </label>
              </div>

              {/* DESCRIPTION */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Describe your product..."
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* FACTORIES */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Factories *
                </label>
                <Controller
                  name="factoryIds"
                  control={control}
                  render={({ field }) => (
                    <AsyncSelect
                      isMulti
                      cacheOptions
                      defaultOptions
                      loadOptions={async (inputValue: string) => {
                        const res = await factoryService.getFactories(0, 50, {
                          name: inputValue,
                        });
                        return res.content.map((f: FactoryResponse) => ({
                          label: f.name,
                          value: f.id,
                        }));
                      }}
                      value={selectedFactories}
                      onChange={(selected) => {
                        const options = selected
                          ? selected.map((s) => ({
                              label: s.label,
                              value: s.value,
                            }))
                          : [];
                        setSelectedFactories(options);
                        field.onChange(options.map((o) => o.value));
                      }}
                      placeholder="Select factories..."
                    />
                  )}
                />{" "}
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
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </label>
                </div>

                {previewUrl && (
                  <div className="mt-4 relative w-40">
                    {mode === "edit" && !isImageChanged ? (
                      <AuthenticatedImage
                        src={previewUrl}
                        alt="Product preview"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <img
                        src={previewUrl}
                        alt="Product preview"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    )}
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
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
          </form>
        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 rounded-b-2xl flex justify-end gap-4 z-10">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {mode === "create" ? "Creating..." : "Updating..."}
              </>
            ) : mode === "create" ? (
              "Create Product"
            ) : (
              "Update Product"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
