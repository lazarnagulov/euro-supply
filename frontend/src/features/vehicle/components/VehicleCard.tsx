import React from "react";
import { Edit2, Trash2, Truck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { VehicleResponse } from "../types/vehicle.types.ts";
import AuthenticatedImage from "../../../components/auth/AuthenticatedImage.tsx";

interface VehicleCardProps {
    vehicle: VehicleResponse;
    onEdit: any;
    onDelete: any;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onEdit, onDelete }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-xl shadow hover:shadow-xl transition-all overflow-hidden">
            <div className="relative h-48 bg-gray-200">
                {vehicle.imageUrls?.[0] ? (
                    <AuthenticatedImage
                        src={vehicle.imageUrls[0].url}
                        alt={vehicle.registrationNumber}
                        className="w-full h-full object-cover"
                        fallback={
                            <div className="w-full h-full flex items-center justify-center">
                                <Truck className="w-16 h-16 text-gray-400" />
                            </div>
                        }
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Truck className="w-16 h-16 text-gray-400" />
                    </div>
                )}

                {vehicle.imageUrls && vehicle.imageUrls.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        +{vehicle.imageUrls.length - 1} more
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {vehicle.registrationNumber}
                </h3>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><span className="font-semibold">Brand:</span> {vehicle.brand.name}</p>
                    <p><span className="font-semibold">Model:</span> {vehicle.model.name}</p>
                    <p><span className="font-semibold">Max Load:</span> {vehicle.maxLoadKg.toLocaleString()} kg</p>
                </div>

                <button
                    onClick={() => navigate(`/vehicles/${vehicle.id}`)}
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

export default VehicleCard;