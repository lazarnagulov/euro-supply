import React from "react";
import { Package } from "lucide-react";
import type { ProductWithImage } from "../types/product.types";
import AuthenticatedImage from "../../../components/auth/AuthenticatedImage.tsx";

interface OrderableProductCardProps {
  product: ProductWithImage;
  onOrder: () => void;
}

const OrderableProductCard: React.FC<OrderableProductCardProps> = ({
  product,
  onOrder,
}) => {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-xl transition-all overflow-hidden">
      <div className="relative h-48 bg-gray-200">
        {product.imageUrl?.url ? (
          <AuthenticatedImage
            src={product.imageUrl.url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <span
          className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full shadow
      ${product.onSale ? "bg-green-600 text-white" : "bg-gray-500 text-white"}
    `}
        >
          {product.onSale ? "Available" : "Not available"}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <p>
            <span className="font-semibold">Category:</span>{" "}
            {product.category?.name || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Price:</span> €{product.price.toFixed(2)}
          </p>
          <p>
            <span className="font-semibold">Weight:</span> {product.weight} kg
          </p>
        </div>

        <button
          onClick={onOrder}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Order
        </button>
      </div>
    </div>
  );
};

export default OrderableProductCard;