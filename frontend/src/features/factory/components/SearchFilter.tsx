import React, { useEffect, useState } from "react";
import { locationService } from "../../../api/services/locationService.ts";
import type { FactorySearchParams } from "../types/factory.types.ts";
import type { Country, City } from "../../../types/location.types.ts";
import { Filter, Search, X } from "lucide-react";

interface SearchFilterProps {
  onSearch: (params: Partial<FactorySearchParams>) => void;
  onClose: () => void;
}

const FactorySearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onClose,
}) => {
  const [filters, setFilters] = useState<FactorySearchParams>({});
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const loadCountries = async () => {
      const data = await locationService.getCountries();
      setCountries(data);
    };
    loadCountries();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      if (filters.countryId !== undefined) {
        const data = await locationService.getCitiesByCountry(
          filters.countryId
        );
        setCities(data);
      } else {
        setCities([]);
      }
    };

    loadCities();
  }, [filters.countryId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params: Partial<FactorySearchParams> = {};

    (Object.keys(filters) as Array<keyof FactorySearchParams>).forEach(
      (key) => {
        const value = filters[key];
        if (value !== undefined && value !== null && value !== "") {
          // @ts-expect-error
          params[key] = value;
        }
      }
    );

    onSearch(params);
  };

  const handleReset = () => {
    setFilters({});
    setCities([]);
    onSearch({});
  };

  const getNumberOrUndefined = (v: string): number | undefined =>
    v === "" ? undefined : Number(v);

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Search & Filter Factories
        </h3>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search factory name..."
            value={filters.name ?? ""}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          <input
            type="text"
            placeholder="Search address..."
            value={filters.address ?? ""}
            onChange={(e) =>
              setFilters({ ...filters, address: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          <select
            value={filters.countryId ?? ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                countryId: getNumberOrUndefined(e.target.value),
                cityId: undefined,
              })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>

          <select
            value={filters.cityId ?? ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                cityId: getNumberOrUndefined(e.target.value),
              })
            }
            disabled={!filters.countryId}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
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

export default FactorySearchFilter;
