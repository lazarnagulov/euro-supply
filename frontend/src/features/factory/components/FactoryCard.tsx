import React from "react";
import { Edit2, Trash2, Factory, MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { FactoryResponse } from "../types/factory.types.ts";
import AuthenticatedImage from "../../../components/auth/AuthenticatedImage.tsx";

interface FactoryCardProps {
  factory: FactoryResponse;
  onEdit: () => void;
  onDelete: () => void;
}

const FactoryCard: React.FC<FactoryCardProps> = ({
  factory,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-xl transition-all overflow-hidden">
      <div className="relative h-48 bg-gray-200">
        {factory.imageUrls?.[0] ? (
          <AuthenticatedImage
            src={factory.imageUrls[0].url}
            alt={factory.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Factory className="w-24 h-24 text-white opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Factory className="w-16 h-16 text-white" />
            </div>
          </div>
        )}

        {factory.imageUrls && factory.imageUrls.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            +{factory.imageUrls.length - 1} more
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{factory.name}</h3>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="font-semibold">Address:</span> {factory.address}
          </p>
          <p>
            <span className="font-semibold">City:</span> {factory.city.name}
          </p>
          <p>
            <span className="font-semibold">Country:</span>{" "}
            {factory.country.name}
          </p>
        </div>

        <button
          onClick={() => navigate(`/factories/${factory.id}`)}
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
            <Edit2 className="w-4 h-4" /> Edit
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

export default FactoryCard;
