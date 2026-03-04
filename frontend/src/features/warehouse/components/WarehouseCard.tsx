import React from "react";
import { Edit2, Trash2, Warehouse, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { WarehouseResponse } from "../types/warehouse.type";
import AuthenticatedImage from "../../../components/auth/AuthenticatedImage.tsx";

interface WarehouseCardProps {
    warehouse: WarehouseResponse;
    onEdit: any;
    onDelete: any;
}

const WarehouseCard: React.FC<WarehouseCardProps> = ({ warehouse, onEdit, onDelete }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-xl shadow hover:shadow-xl transition-all overflow-hidden">
            <div className="relative h-48 bg-gray-200">
                {warehouse.imageUrls?.[0] ? (
                    <AuthenticatedImage
                        src={warehouse.imageUrls[0].url}
                        className="w-full h-full object-cover"
                        alt={`Warehouse`}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Warehouse className="w-16 h-16 text-gray-400" />
                    </div>
                )}

                {warehouse.imageUrls && warehouse.imageUrls.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        +{warehouse.imageUrls.length - 1} more
                    </div>
                )}
            </div>

            <div className="p-4">

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><span className="font-semibold">Name:</span> {warehouse.name}</p>
                    {<p><span className="font-semibold">Address:</span> {warehouse.address}</p>}
                </div>

                <button
                    onClick={() => navigate(`/warehouses/${warehouse.id}`)}
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

export default WarehouseCard;