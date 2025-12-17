import React from "react";
import {Edit2, Trash2, Truck} from "lucide-react";
import type {VehicleResponse} from "../types/vehicle.types.ts";

interface VehicleCardProps {
    vehicle: VehicleResponse;
    onEdit: any;
    onDelete: any;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-xl shadow hover:shadow-xl transition-all overflow-hidden">
            <div className="relative h-48 bg-gray-200">
                {vehicle.imageUrls && vehicle.imageUrls[0] ? (
                    <img
                        src={vehicle.imageUrls[0].url}
                        alt={vehicle.registrationNumber}
                        className="w-full h-full object-cover"
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
                <h3 className="text-xl font-bold text-gray-800 mb-2">{vehicle.registrationNumber}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>
                        <span className="font-semibold">Brand:</span> {vehicle.brand.name}
                    </p>
                    <p>
                        <span className="font-semibold">Model:</span> {vehicle.model.name}
                    </p>
                    <p>
                        <span className="font-semibold">Max Load:</span> {vehicle.maxLoadKg.toLocaleString()} kg
                    </p>
                </div>

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

export default VehicleCard;