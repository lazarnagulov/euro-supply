import React, { useEffect, useState } from "react";
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Car,
    ChartBar
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
import {vehicleService} from "../../../api/services/vehicleService.ts";
import {PeriodSelector} from "../../../components/common/PeriodSelector.tsx";

const VehicleDetailsPage: React.FC = () => {
    const { vehicleId } = useParams();
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState<VehicleResponse | null>(null);
    const [distanceData, _setDistanceData] = useState<DistancePoint[]>([]);
    const [availabilityData, _setAvailablityData] = useState<any>([]);
    const [loading, setLoading] = useState(true);

    const [selectedTraveledPeriod, setSelectedTraveledPeriod] = useState<DistanceAggregation | null>("7d");
    const [useCustomTraveledRange, setUseCustomTraveledRange] = useState(false);
    const [customTraveledFrom, setCustomTraveledFrom] = useState("");
    const [customTraveledTo, setCustomTraveledTo] = useState("");

    const [selectedAvailablityPeriod, setSelectedAvailablityPeriod] = useState<DistanceAggregation | null>("7d");
    const [useCustomAvailablityRange, setUseCustomAvailablityRange] = useState(false);
    const [customAvailablityFrom, setCustomAvailablityFrom] = useState("");
    const [customAvailablityTo, setCustomAvailablityTo] = useState("");


    useEffect(() => {
        if (!vehicleId) return;

        const loadDetails = async () => {
            setLoading(true);
            try {
                const vehicleData = await vehicleService.getVehicle(+vehicleId);
                setVehicle(vehicleData);
                // const distanceDefault = await vehicleService.getDistance(vehicleId, "7d");
                // setDistanceData(distanceDefault);
            } catch (err) {
                console.error("Failed to load vehicle details:", err);
            } finally {
                setLoading(false);
            }
        };

        loadDetails();
    }, [vehicleId]);

    const loadTraveledPeriod = async (period: DistanceAggregation) => {
        if (!vehicleId) return;
        try {
            setLoading(true);
            setUseCustomTraveledRange(false);
            setSelectedTraveledPeriod(period);

            // const distance = await vehicleService.getDistance(vehicleId, period);
            // setDistanceData(distance);
        } finally {
            setLoading(false);
        }
    };

    const loadAvailabilityPeriod = async (period: DistanceAggregation) => {
        if (!vehicleId) return;
        try {
            setLoading(true);
            setUseCustomAvailablityRange(false);
            setSelectedAvailablityPeriod(period);

            // const distance = await vehicleService.getDistance(vehicleId, period);
            // setDistanceData(distance);
        } finally {
            setLoading(false);
        }
    };

    const applyCustomRange = async () => {
        if (!customTraveledFrom || !customTraveledTo || !vehicleId) return;

        const from = new Date(customTraveledFrom);
        const to = new Date(customTraveledTo);

        const diffDays = (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);

        if (diffDays > 365) {
            return;
        }

        try {
            setLoading(true);
            // const data = await vehicleService.getDistanceCustomRange(vehicleId, from, to);
            // setDistanceData(data);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow p-12 text-center">
                <div
                    className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading vehicle...</p>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div
                className="flex flex-col items-center justify-center text-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
                <div className="p-6 bg-red-100 text-red-600 rounded-full shadow-inner mb-4">
                    <Car size={48}/>
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
        <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-100">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-700 hover:text-black"
            >
                <ArrowLeft size={18}/>
                Back
            </button>

            <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-4 rounded-2xl shadow">
                    <Car size={40}/>
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
                    <Car size={18}/> Vehicle Images
                </h2>

                {loading && (
                    <div className="grid grid-cols-3 gap-4">
                        {Array.from({length: 3}).map((_, i) => (
                            <div
                                key={i}
                                className="w-full h-32 bg-gray-200 animate-pulse rounded-xl"
                            ></div>
                        ))}
                    </div>
                )}

                {!loading && (!vehicle.imageUrls || vehicle.imageUrls.length === 0) && (
                    <div className="flex flex-col items-center justify-center text-center py-6">
                        <div className="p-4 bg-gray-100 rounded-full mb-2">
                            <Car size={32} className="text-gray-500"/>
                        </div>
                        <p className="text-gray-500">No images available for this vehicle.</p>
                    </div>
                )}

                {!loading && vehicle.imageUrls && vehicle.imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {vehicle.imageUrls.slice(0, 6).map((url, index) => (
                            <div
                                key={"vehicle_" + index}
                                className="relative group cursor-pointer rounded-xl overflow-hidden shadow-sm border"
                            >
                                <img
                                    src={url}
                                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                                    alt={`Vehicle ${index + 1}`}
                                    loading="lazy"
                                />

                                <div
                                    className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-medium text-sm">
                                    View
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && vehicle.imageUrls && vehicle.imageUrls.length > 6 && (
                    <p className="text-sm text-gray-500 italic">
                        Showing 6 of {vehicle.imageUrls.length} images
                    </p>
                )}
            </div>
            {vehicle.lastLocation && (
                <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <MapPin size={18}/> Last known location
                    </h2>

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
                </div>
            )
            }
            {!vehicle.lastLocation && (
                <div className="bg-white rounded-2xl shadow p-6 space-y-6">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                        <MapPin size={18} aria-hidden="true"/>
                        Last Known Location
                    </h2>
                    <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                        <h3 className="text-xl font-bold text-red-700 mb-2">
                            Oops! The last known location is unavailable.
                        </h3>
                        <p className="text-gray-600">
                            It seems we are unable to retrieve the location at the moment. Please try again later or
                            check your internet connection.
                        </p>
                    </div>
                </div>
            )}


            <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Calendar size={18}/> Total distance travelled
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
                    onApplyCustomRange={applyCustomRange}
                />
            </div>

            <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                <h3 className="font-semibold">Distance Chart</h3>

                <div className="w-full h-72">
                    <ResponsiveContainer>
                        <LineChart data={distanceData}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="label"/>
                            <YAxis/>
                            <Tooltip/>
                            <Line type="monotone" dataKey="distance" stroke="#2563eb" strokeWidth={3}/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <ChartBar  size={18}/> Availability
                </h2>

                <PeriodSelector
                    selectedPeriod={selectedAvailablityPeriod}
                    onSelectPeriod={loadAvailabilityPeriod}

                    useCustomRange={useCustomAvailablityRange}
                    onToggleCustomRange={() => {
                        setUseCustomAvailablityRange(!useCustomAvailablityRange);
                        setSelectedAvailablityPeriod(null);
                    }}

                    customFrom={customAvailablityFrom}
                    customTo={customAvailablityTo}
                    onCustomFromChange={setCustomAvailablityFrom}
                    onCustomToChange={setCustomAvailablityTo}
                    onApplyCustomRange={applyCustomRange}
                />
            </div>

            <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                <h3 className="font-semibold">Availability Chart</h3>

                <div className="w-full h-72">
                    <ResponsiveContainer>
                        <LineChart data={availabilityData}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="label"/>
                            <YAxis/>
                            <Tooltip/>
                            <Line type="monotone" dataKey="distance" stroke="#2563eb" strokeWidth={3}/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailsPage;
