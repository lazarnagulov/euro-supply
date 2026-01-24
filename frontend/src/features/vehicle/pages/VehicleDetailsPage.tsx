import React, { useState } from "react";
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Car,
    ChartBar,
    RefreshCw,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { useNavigate, useParams } from "react-router-dom";
import { InteractiveMap } from "../../../components/map/InteractiveMap";
import { PeriodSelector } from "../../../components/common/PeriodSelector";
import { useVehicleData } from "../hooks/useVehicleData";
import { useDistanceData } from "../hooks/useDistanceData";
import { useAvailabilityData } from "../hooks/useAvailabilityData";
import { usePeriodSelector } from "../../../hooks/common/usePeriodSelector";
import { ImageModal } from "../../../components/modal/ImageModal";
import { useVehiclePolling } from "../hooks/useVehiclePolling";
import AppToaster from "../../../components/common/AppToaster.tsx";
import AvailabilityCharts from "../components/charts/VehicleAvailabilityCharts.tsx";

const VehicleDetailsPage: React.FC = () => {
    const { vehicleId } = useParams();
    const navigate = useNavigate();
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const {
        vehicle,
        loading: vehicleLoading,
        updateLocation,
        updateStatus
    } = useVehicleData(vehicleId);

    const { refreshLocation } = useVehiclePolling({
        vehicleId,
        onLocationUpdate: updateLocation,
        onStatusUpdate: updateStatus,
        locationInterval: 5 * 60 * 1000,
        statusInterval: 2 * 60 * 1000,
        enabled: !!vehicle,
    });

    const traveledPeriod = usePeriodSelector("7d");
    const {
        distanceData,
        loading: distanceLoading,
        loadPeriod: loadTraveledPeriod,
        loadCustomRange: loadTraveledCustomRange,
    } = useDistanceData(vehicleId);

    const availabilityPeriod = usePeriodSelector("7d");
    const {
        availabilityData,
        loading: availabilityLoading,
        loadPeriod: loadAvailabilityPeriod,
        loadCustomRange: loadAvailabilityCustomRange,
    } = useAvailabilityData(vehicleId);

    const handleTraveledPeriodSelect = async (period: string) => {
        traveledPeriod.setSelectedPeriod(period as any);
        if (traveledPeriod.useCustomRange) {
            traveledPeriod.toggleCustomRange();
        }
        await loadTraveledPeriod(period as any);
    };

    const handleTraveledCustomRange = async () => {
        const range = traveledPeriod.validateDateRange();
        if (!range) return;
        await loadTraveledCustomRange(range.from, range.to, range.diffDays);
    };

    const handleAvailabilityPeriodSelect = async (period: string) => {
        availabilityPeriod.setSelectedPeriod(period as any);
        if (availabilityPeriod.useCustomRange) {
            availabilityPeriod.toggleCustomRange();
        }
        await loadAvailabilityPeriod(period as any);
    };

    const handleAvailabilityCustomRange = async () => {
        const range = availabilityPeriod.validateDateRange();
        if (!range) return;
        await loadAvailabilityCustomRange(range.from, range.to);
    };

    const openImageModal = (index: number) => {
        setSelectedImageIndex(index);
    };

    const closeImageModal = () => {
        setSelectedImageIndex(null);
    };

    const goToPreviousImage = () => {
        if (selectedImageIndex !== null && vehicle?.imageUrls) {
            setSelectedImageIndex((selectedImageIndex - 1 + vehicle.imageUrls.length) % vehicle.imageUrls.length);
        }
    };

    const goToNextImage = () => {
        if (selectedImageIndex !== null && vehicle?.imageUrls) {
            setSelectedImageIndex((selectedImageIndex + 1) % vehicle.imageUrls.length);
        }
    };

    if (vehicleLoading) {
        return (
            <div className="bg-white rounded-xl shadow p-12 text-center">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading vehicle...</p>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="flex flex-col items-center justify-center text-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
                <div className="p-6 bg-red-100 text-red-600 rounded-full shadow-inner mb-4">
                    <Car size={48} />
                </div>
                <h2 className="text-2xl font-bold text-red-700 mb-2">
                    Vehicle not found
                </h2>
                <p className="text-gray-600 max-w-md mb-6">
                    The requested vehicle could not be located. It may have been removed,
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
        <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
            <AppToaster />
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
            >
                <ArrowLeft size={18} />
                Back
            </button>

            <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-4 rounded-2xl shadow">
                    <Car size={40} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">{vehicle.registrationNumber}</h1>
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                                vehicle.online
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            <span className={`w-2 h-2 rounded-full ${
                                vehicle.online ? 'bg-green-500' : 'bg-gray-400'
                            }`}></span>
                            {vehicle.online ? 'Online' : 'Offline'}
                        </span>
                    </div>
                    <p className="text-gray-600">
                        {vehicle.brand.name} {vehicle.model.name}
                    </p>
                    <p className="text-gray-600">Max load: {vehicle.maxLoadKg} kg</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Car size={18} /> Vehicle Images
                </h2>

                {(!vehicle.imageUrls || vehicle.imageUrls.length === 0) && (
                    <div className="flex flex-col items-center justify-center text-center py-6">
                        <div className="p-4 bg-gray-100 rounded-full mb-2">
                            <Car size={32} className="text-gray-500" />
                        </div>
                        <p className="text-gray-500">
                            No images available for this vehicle.
                        </p>
                    </div>
                )}

                {vehicle.imageUrls && vehicle.imageUrls.length > 0 && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {vehicle.imageUrls.slice(0, 6).map((fileResponse, index) => (
                                <div
                                    key={`vehicle_${index}`}
                                    className="relative group cursor-pointer rounded-xl overflow-hidden shadow-sm border"
                                    onClick={() => openImageModal(index)}
                                >
                                    <img
                                        src={fileResponse.url}
                                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                                        alt={`Vehicle ${index + 1}`}
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-medium text-sm">
                                        View
                                    </div>
                                </div>
                            ))}
                        </div>
                        {vehicle.imageUrls.length > 6 && (
                            <p className="text-sm text-gray-500 italic">
                                Showing 6 of {vehicle.imageUrls.length} images
                            </p>
                        )}
                    </>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <MapPin size={18} /> Last Known Location
                    </h2>
                    <button
                        onClick={refreshLocation}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                        title="Refresh location"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>

                {vehicle.lastLocation ? (
                    <>
                        <InteractiveMap
                            center={[
                                vehicle.lastLocation.latitude,
                                vehicle.lastLocation.longitude,
                            ]}
                            selectedPosition={[
                                vehicle.lastLocation.latitude,
                                vehicle.lastLocation.longitude,
                            ]}
                            readOnly={true}
                            height="400px"
                        />
                        <p className="text-sm text-gray-600">
                            {vehicle.lastLocation.latitude.toFixed(5)},{" "}
                            {vehicle.lastLocation.longitude.toFixed(5)} —{" "}
                            {new Date(vehicle.lastLocation.timestamp).toLocaleString()}
                        </p>
                    </>
                ) : (
                    <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                        <h3 className="text-xl font-bold text-red-700 mb-2">
                            Location Unavailable
                        </h3>
                        <p className="text-gray-600">
                            Unable to retrieve the last known location. Please try again
                            later.
                        </p>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Calendar size={18} /> Total Distance Travelled
                </h2>

                <PeriodSelector
                    selectedPeriod={traveledPeriod.selectedPeriod}
                    onSelectPeriod={handleTraveledPeriodSelect}
                    useCustomRange={traveledPeriod.useCustomRange}
                    onToggleCustomRange={traveledPeriod.toggleCustomRange}
                    customFrom={traveledPeriod.customFrom}
                    customTo={traveledPeriod.customTo}
                    onCustomFromChange={traveledPeriod.setCustomFrom}
                    onCustomToChange={traveledPeriod.setCustomTo}
                    onApplyCustomRange={handleTraveledCustomRange}
                />

                <div className="relative">
                    <h3 className="font-semibold mb-4">Distance Chart</h3>
                    <div className="w-full h-72 relative">
                        {distanceLoading && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
                                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        <ResponsiveContainer>
                            <LineChart data={distanceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="time"
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="distance"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <ChartBar size={18} /> Availability
                </h2>

                <PeriodSelector
                    selectedPeriod={availabilityPeriod.selectedPeriod}
                    onSelectPeriod={handleAvailabilityPeriodSelect}
                    useCustomRange={availabilityPeriod.useCustomRange}
                    onToggleCustomRange={availabilityPeriod.toggleCustomRange}
                    customFrom={availabilityPeriod.customFrom}
                    customTo={availabilityPeriod.customTo}
                    onCustomFromChange={availabilityPeriod.setCustomFrom}
                    onCustomToChange={availabilityPeriod.setCustomTo}
                    onApplyCustomRange={handleAvailabilityCustomRange}
                    mode={"availability"}
                />

                <AvailabilityCharts
                    data={availabilityData}
                    loading={availabilityLoading}
                />
            </div>

            <div className="p-0 space-y-0">
                <ImageModal
                    images={vehicle?.imageUrls || []}
                    selectedIndex={selectedImageIndex}
                    onClose={closeImageModal}
                    onPrevious={goToPreviousImage}
                    onNext={goToNextImage}
                />
            </div>
        </div>
    );
};

export default VehicleDetailsPage;