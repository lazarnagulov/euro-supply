import React, { useEffect, useState } from "react";
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Car,
    ChartBar, AlertTriangle
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
import type {
    DistancePoint,
    DistanceAggregation,
    VehicleResponse,
} from "../types/vehicle.types";
import { vehicleService } from "../../../api/services/vehicleService.ts";
import { PeriodSelector } from "../../../components/common/PeriodSelector.tsx";
import { calculateStartDate } from "../../../utils/dateUtils.ts";
import { transformDistanceData } from "../../../utils/dataTransformers.ts";
import toast, {Toaster} from "react-hot-toast";

const VehicleDetailsPage: React.FC = () => {
    const { vehicleId } = useParams();
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState<VehicleResponse | null>(null);
    const [distanceData, setDistanceData] = useState<DistancePoint[]>([]);
    const [availabilityData, _setAvailabilityData] = useState<any>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [distanceLoading, setDistanceLoading] = useState(false);

    const [selectedTraveledPeriod, setSelectedTraveledPeriod] = useState<DistanceAggregation | null>("7d");
    const [useCustomTraveledRange, setUseCustomTraveledRange] = useState(false);
    const [customTraveledFrom, setCustomTraveledFrom] = useState("");
    const [customTraveledTo, setCustomTraveledTo] = useState("");

    const [selectedAvailabilityPeriod, setSelectedAvailabilityPeriod] = useState<DistanceAggregation | null>("7d");
    const [useCustomAvailabilityRange, setUseCustomAvailabilityRange] = useState(false);
    const [customAvailabilityFrom, setCustomAvailabilityFrom] = useState("");
    const [customAvailabilityTo, setCustomAvailabilityTo] = useState("");

    useEffect(() => {
        if (!vehicleId) return;

        const loadDetails = async () => {
            setInitialLoading(true);
            const start = calculateStartDate(selectedTraveledPeriod ?? "7d");
            const end = new Date().toISOString();
            try {
                const vehicleData = await vehicleService.getVehicle(+vehicleId);
                setVehicle(vehicleData);
                const distances = await vehicleService.getDistances(+vehicleId, { start, end });
                setDistanceData(transformDistanceData(distances));
            } catch (err) {
                console.error("Failed to load vehicle details:", err);
                toast.error("Failed to load vehicle details. Please try again.");
            } finally {
                setInitialLoading(false);
            }
        };

        loadDetails();
    }, [vehicleId]);

    const loadTraveledPeriod = async (period: DistanceAggregation) => {
        if (!vehicleId) return;

        try {
            setDistanceLoading(true);
            setUseCustomTraveledRange(false);
            setSelectedTraveledPeriod(period);
            const start = calculateStartDate(period);
            const end = new Date().toISOString();
            const distances = await vehicleService.getDistances(+vehicleId, { start, end });
            setDistanceData(transformDistanceData(distances));
            toast.success("Distance data updated successfully");
        } catch (err) {
            console.error("Failed to load distance data:", err);
            toast.error("Failed to load distance data. Please try again.");
        } finally {
            setDistanceLoading(false);
        }
    };

    const loadAvailabilityPeriod = async (period: DistanceAggregation) => {
        if (!vehicleId) return;
        try {
            setUseCustomAvailabilityRange(false);
            setSelectedAvailabilityPeriod(period);
            // TODO: Implement availability loading
        } catch (err) {
            console.error("Failed to load availability data:", err);
            toast.error("Failed to load availability data. Please try again.");
        }
    };

    const applyCustomTraveledRange = async () => {
        if (!customTraveledFrom || !customTraveledTo || !vehicleId) return;

        const from = new Date(customTraveledFrom);
        const to = new Date(customTraveledTo);

        const diffDays = (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);

        if (diffDays > 365) {
            toast.error("Date range cannot exceed 365 days", {
                duration: 5000,
                icon: <AlertTriangle size={24} color="red" />,
            });
            return;
        }

        if (diffDays < 0) {
            toast.error("End date must be after start date");
            return;
        }

        try {
            setDistanceLoading(true);
            const distances = await vehicleService.getDistances(+vehicleId, {
                start: from.toISOString(),
                end: to.toISOString(),
            });
            setDistanceData(transformDistanceData(distances));
            toast.success(`Loaded data for ${Math.round(diffDays)} days`);
        } catch (err) {
            console.error("Failed to load custom range data:", err);
            toast.error("Failed to load custom range data. Please try again.");
        } finally {
            setDistanceLoading(false);
        }
    };

    const applyCustomAvailabilityRange = async () => {
        if (!customAvailabilityFrom || !customAvailabilityTo || !vehicleId) return;

        const from = new Date(customAvailabilityFrom);
        const to = new Date(customAvailabilityTo);

        const diffDays = (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);

        if (diffDays > 365) {
            toast.error("Date range cannot exceed 365 days");
            return;
        }

        if (diffDays < 0) {
            toast.error("End date must be after start date");
            return;
        }

        try {
            // TODO: Implement availability custom range loading
        } catch (err) {
            console.error("Failed to load custom availability range:", err);
            toast.error("Failed to load custom availability data.");
        }
    };

    if (initialLoading) {
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
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#fff',
                        color: '#363636',
                        borderRadius: '12px',
                        padding: '16px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
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

            <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-4 rounded-2xl shadow">
                    <Car size={40} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">{vehicle.registrationNumber}</h1>
                    <p className="text-gray-600">
                        {vehicle.brand.name} {vehicle.model.name}
                    </p>
                    <p className="text-gray-600">
                        Max load: {vehicle.maxLoadKg} kg
                    </p>
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
                        <p className="text-gray-500">No images available for this vehicle.</p>
                    </div>
                )}

                {vehicle.imageUrls && vehicle.imageUrls.length > 0 && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {vehicle.imageUrls.slice(0, 6).map((url, index) => (
                                <div
                                    key={`vehicle_${index}`}
                                    className="relative group cursor-pointer rounded-xl overflow-hidden shadow-sm border"
                                >
                                    <img
                                        src={url}
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
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin size={18} /> Last Known Location
                </h2>

                {vehicle.lastLocation ? (
                    <>
                        <InteractiveMap
                            center={[vehicle.lastLocation.latitude, vehicle.lastLocation.longitude]}
                            selectedPosition={[vehicle.lastLocation.latitude, vehicle.lastLocation.longitude]}
                            readOnly={true}
                            height="400px"
                        />
                        <p className="text-sm text-gray-600">
                            {vehicle.lastLocation.latitude.toFixed(5)}, {vehicle.lastLocation.longitude.toFixed(5)} —{" "}
                            {new Date(vehicle.lastLocation.timestamp).toLocaleString()}
                        </p>
                    </>
                ) : (
                    <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                        <h3 className="text-xl font-bold text-red-700 mb-2">
                            Location Unavailable
                        </h3>
                        <p className="text-gray-600">
                            Unable to retrieve the last known location. Please try again later.
                        </p>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Calendar size={18} /> Total Distance Travelled
                </h2>

                <PeriodSelector
                    selectedPeriod={selectedTraveledPeriod}
                    onSelectPeriod={loadTraveledPeriod}
                    useCustomRange={useCustomTraveledRange}
                    onToggleCustomRange={() => {
                        setUseCustomTraveledRange(!useCustomTraveledRange);
                        setSelectedTraveledPeriod(null);
                    }}
                    customFrom={customTraveledFrom}
                    customTo={customTraveledTo}
                    onCustomFromChange={setCustomTraveledFrom}
                    onCustomToChange={setCustomTraveledTo}
                    onApplyCustomRange={applyCustomTraveledRange}
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
                    selectedPeriod={selectedAvailabilityPeriod}
                    onSelectPeriod={loadAvailabilityPeriod}
                    useCustomRange={useCustomAvailabilityRange}
                    onToggleCustomRange={() => {
                        setUseCustomAvailabilityRange(!useCustomAvailabilityRange);
                        setSelectedAvailabilityPeriod(null);
                    }}
                    customFrom={customAvailabilityFrom}
                    customTo={customAvailabilityTo}
                    onCustomFromChange={setCustomAvailabilityFrom}
                    onCustomToChange={setCustomAvailabilityTo}
                    onApplyCustomRange={applyCustomAvailabilityRange}
                />

                <div>
                    <h3 className="font-semibold mb-4">Availability Chart</h3>
                    <div className="w-full h-72">
                        <ResponsiveContainer>
                            <LineChart data={availabilityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="distance" stroke="#2563eb" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailsPage;