import React from "react";
import { ArrowLeft, Package, Tag, Weight, DollarSign } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useProductData } from "../hooks/useProductData";

const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { product, loading: productLoading } = useProductData(productId);

  if (productLoading) {
    return (
      <div className="bg-white rounded-xl shadow p-12 text-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center text-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="p-6 bg-red-100 text-red-600 rounded-full shadow-inner mb-4">
          <Package size={48} />
        </div>
        <h2 className="text-2xl font-bold text-red-700 mb-2">
          Product not found
        </h2>
        <p className="text-gray-600 max-w-md mb-6">
          The requested product could not be located. It may have been removed,
          or the ID is incorrect.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 to-teal-100 min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#363636",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="bg-gray-100 p-4 rounded-2xl shadow">
          <Package size={40} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.category.name}</p>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-indigo-600 font-semibold text-lg">
              ${product.price.toFixed(2)}
            </p>
            {product.onSale && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                On Sale
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Product Image */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Package size={18} /> Product Image
        </h2>

        {!product.imageUrl ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="p-6 bg-gray-100 rounded-full mb-4">
              <Package size={48} className="text-gray-400" />
            </div>
            <p className="text-gray-500">
              No image available for this product.
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="relative group rounded-xl overflow-hidden shadow-lg border max-w-2xl">
              <img
                src={product.imageUrl.url}
                className="w-full h-96 object-cover"
                alt={product.name}
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Tag size={18} /> Product Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Description */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <Package size={16} />
              Description
            </h3>
            <p className="text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-lg">
              {product.description}
            </p>
          </div>

          {/* Price */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <DollarSign size={16} />
              Price
            </h3>
            <p className="text-2xl font-bold text-indigo-600">
              ${product.price.toFixed(2)}
            </p>
          </div>

          {/* Weight */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <Weight size={16} />
              Weight
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              {product.weight} kg
            </p>
          </div>

          {/* Category */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <Tag size={16} />
              Category
            </h3>
            <p className="text-lg font-medium text-gray-800 bg-indigo-50 px-4 py-2 rounded-lg inline-block">
              {product.category.name}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <Tag size={16} />
              Producing in Factories
            </h3>
            <p className="text-lg font-medium text-gray-800 bg-indigo-50 px-4 py-2 rounded-lg inline-block">
              {product.factoryNames.length > 0
                ? product.factoryNames.join(", ")
                : "No factories associated"}
            </p>
          </div>

          {/* Sale Status */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <Tag size={16} />
              Status
            </h3>

            <span
              className={`px-4 py-2 font-semibold rounded-lg inline-block
      ${
        product.onSale
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-700"
      }
    `}
            >
              {product.onSale ? "Available" : "Not available"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
