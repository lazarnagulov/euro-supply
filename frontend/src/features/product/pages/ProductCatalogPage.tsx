import { Package, Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { ProductWithImage } from "../types/product.types";
import { productService } from "../../../api/services/productService";
import Pagination from "../../../components/common/Pagination";
import OrderableProductCard from "../components/OrderableProductCard";
import OrderModal from "../components/OrderProductModal";
import { companyService } from "../../../api/services/companyService";
import { type CompanySummaryResponse } from "../../company/types/company.types";
import toast from "react-hot-toast";

const ProductCatalogPage = () => {
  const [products, setProducts] = useState<ProductWithImage[]>([]);
  const [companies, setCompanies] = useState<CompanySummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithImage | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const pageSize = 9;

  useEffect(() => {
    if (!searchKeyword) {
      loadProducts();
    }
  }, [currentPage]);

  useEffect(() => {
    if (searchKeyword) {
      searchProducts();
    }
  }, [searchKeyword, currentPage]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await companyService.getMyCompanies();
        setCompanies(response);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAvailableProducts(
        currentPage,
        pageSize
      );
      setProducts(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.searchProducts(
        searchKeyword,
        currentPage,
        pageSize
      );
      setProducts(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Failed to search products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchKeyword(searchTerm.trim());
    setCurrentPage(0);
    setShowFilters(false);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchKeyword("");
    setCurrentPage(0);
    setShowFilters(false);
    loadProducts();
  };

  const handleOrderModal = (product: ProductWithImage) => {
    setShowModal(true);
    setSelectedProduct(product);
  };

  const handleOrder = async (companyId: number, quantity: number) => {
    try {
        if (companyId && selectedProduct?.id) {
        await productService.order({ companyId, quantity, productId: selectedProduct?.id });
        toast.success("Order placed successfully!");
        setShowModal(false);
        setSelectedProduct(null);
    }
    } catch (err: any) {
      console.log(err);
      const errorMessage =
        err.response?.data?.message ?? "Order failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Product Catalog
                </h1>
                <p className="text-gray-600">Order products from your catalog</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
              {searchKeyword && (
                <button
                  onClick={handleClearSearch}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Search Products</h2>

              <form onSubmit={handleSearchSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by product name..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Products Found
            </h3>
            {searchKeyword && (
              <p className="text-gray-600 mt-2">
                Try adjusting your search term
              </p>
            )}
          </div>
        )}

        {!loading && products.length > 0 && (
          <>
            {searchKeyword && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  Showing results for: <strong>"{searchKeyword}"</strong>
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {products.map((product) => (
                <OrderableProductCard
                  key={product.id}
                  product={product}
                  onOrder={() => handleOrderModal(product)}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
        {showModal && selectedProduct && (
          <OrderModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setSelectedProduct(null);
            }}
            onOrder={handleOrder}
            companies={companies}
          />
        )}
      </div>
    </div>
  );
};

export default ProductCatalogPage;