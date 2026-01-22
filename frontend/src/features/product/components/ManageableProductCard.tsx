import React from "react";
import { Edit2, Trash2, Package, ArrowRight } from "lucide-react";
import type { ProductWithImage } from "../types/product.types";
import { useNavigate } from "react-router-dom";

interface ManageableProductCardProps {
  product: ProductWithImage;
  onEdit: () => void;
  onDelete: () => void;
}

const ManageableProductCard: React.FC<ManageableProductCardProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-xl transition-all overflow-hidden">
      {/* IMAGE */}
      <div className="relative h-48 bg-gray-200">
        {product.imageUrl?.url ? (
          <img
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

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <p>
            <span className="font-semibold">Category:</span>{" "}
            {product.category?.name || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Price:</span> €
            {product.price.toFixed(2)}
          </p>
          <p>
            <span className="font-semibold">Weight:</span> {product.weight} kg
          </p>
        </div>

        {/* ACTIONS */}
        <button
          onClick={() => navigate(`/products/${product.id}`)}
          className="w-full mb-3 flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          View details
          <ArrowRight size={16} />
        </button>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>

          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageableProductCard;
