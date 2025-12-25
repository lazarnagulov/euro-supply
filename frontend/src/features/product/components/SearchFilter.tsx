import React, { useEffect, useState } from "react";
import { categoryService } from "../../../api/services/categoryService";
import type { Category } from "../types/category.types";
import type { ProductSearchParams } from "../types/product.types";
import { Filter, Search, X } from "lucide-react";

interface SearchFilterProps {
  onSearch: (params: Partial<ProductSearchParams>) => void;
  onClose: () => void;
}

const SearchFilters: React.FC<SearchFilterProps> = ({ onSearch, onClose }) => {
  const [filters, setFilters] = useState<ProductSearchParams>({});
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    loadCategories();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params: Partial<ProductSearchParams> = {};

    (Object.keys(filters) as Array<keyof ProductSearchParams>).forEach(
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
    onSearch({});
  };

  const getNumberOrUndefined = (v: string): number | undefined =>
    v === "" ? undefined : Number(v);

  const getBooleanOrUndefined = (v: string): boolean | undefined =>
    v === "" ? undefined : v === "true";

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Search & Filter Products
        </h3>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Name Search */}
          <input
            type="text"
            placeholder="Search by name..."
            value={filters.name ?? ""}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          {/* Description Search */}
          <input
            type="text"
            placeholder="Search by description..."
            value={filters.description ?? ""}
            onChange={(e) =>
              setFilters({ ...filters, description: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          {/* Category */}
          <select
            value={filters.categoryId ?? ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                categoryId: getNumberOrUndefined(e.target.value),
              })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Min Price */}
          <input
            type="number"
            placeholder="Min price"
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                minPrice: getNumberOrUndefined(e.target.value),
              })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          {/* Max Price */}
          <input
            type="number"
            placeholder="Max price"
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                maxPrice: getNumberOrUndefined(e.target.value),
              })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          {/* Min Weight */}
          <input
            type="number"
            placeholder="Min weight (kg)"
            value={filters.minWeight ?? ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                minWeight: getNumberOrUndefined(e.target.value),
              })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          {/* Max Weight */}
          <input
            type="number"
            placeholder="Max weight (kg)"
            value={filters.maxWeight ?? ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                maxWeight: getNumberOrUndefined(e.target.value),
              })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          {/* On Sale */}
          <select
            value={
              filters.onSale === undefined ? "" : filters.onSale.toString()
            }
            onChange={(e) =>
              setFilters({
                ...filters,
                onSale: getBooleanOrUndefined(e.target.value),
              })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All Products</option>
            <option value="true">On Sale</option>
            <option value="false">Not On Sale</option>
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

export default SearchFilters;
