import React, { useEffect, useState } from "react";
import { vehicleService } from "../../../api/services/vehicleService.ts";
import type {
    VehicleBrand,
    VehicleModel,
    VehicleSearchParams,
} from "../types/vehicle.types.ts";
import { Filter, Search, X } from "lucide-react";

interface SearchFilterProps {
    onSearch: (params: Partial<VehicleSearchParams>) => void;
    onClose: () => void;
}

const SearchFilters: React.FC<SearchFilterProps> = ({ onSearch, onClose }) => {
    const [filters, setFilters] = useState<VehicleSearchParams>({});
    const [brands, setBrands] = useState<VehicleBrand[]>([]);
    const [models, setModels] = useState<VehicleModel[]>([]);

    useEffect(() => {
        const loadBrands = async () => {
            const data = await vehicleService.getBrands();
            setBrands(data);
        };
        loadBrands();
    }, []);

    useEffect(() => {
        const loadModels = async () => {
            if (filters.brandId !== undefined) {
                const data = await vehicleService.getModelsByBrand(filters.brandId);
                setModels(data);
            } else {
                setModels([]);
            }
        };

        loadModels();
    }, [filters.brandId]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const params: Partial<VehicleSearchParams> = {};

        (Object.keys(filters) as Array<keyof VehicleSearchParams>).forEach(
            (key) => {
                const value = filters[key];
                if (value !== undefined && value !== null && value !== "") {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    params[key] = value;
                }
            }
        );

        onSearch(params);
    };

    const handleReset = () => {
        setFilters({});
        setModels([]);
        onSearch({});
    };

    // Helpers
    const getNumberOrUndefined = (v: string): number | undefined =>
        v === "" ? undefined : Number(v);

    return (
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Search & Filter Vehicles
                </h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

                    <input
                        type="text"
                        placeholder="Search registration..."
                        value={filters.search ?? ""}
                        onChange={(e) =>
                            setFilters({ ...filters, search: e.target.value })
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />

                    <select
                        value={filters.brandId ?? ""}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                brandId: getNumberOrUndefined(e.target.value),
                                modelId: undefined,
                            })
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="">All Brands</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.modelId ?? ""}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                modelId: getNumberOrUndefined(e.target.value),
                            })
                        }
                        disabled={!filters.brandId}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                    >
                        <option value="">All Models</option>
                        {models.map((model) => (
                            <option key={model.id} value={model.id}>
                                {model.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Min load (kg)"
                        value={filters.minLoad ?? ""}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                minLoad: getNumberOrUndefined(e.target.value),
                            })
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />

                    <input
                        type="number"
                        placeholder="Max load (kg)"
                        value={filters.maxLoad ?? ""}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                maxLoad: getNumberOrUndefined(e.target.value),
                            })
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                <div className="flex gap-3 mt-4">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                        <Search className="w-4 h-4" />
                        Search
                    </button>

                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SearchFilters;
