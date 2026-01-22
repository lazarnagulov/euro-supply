import { useEffect, useState } from "react";
import { productService } from "../../../api/services/productService";
import type {
  ProductSearchParams,
  ProductWithImage,
} from "../types/product.types";
import ManageableProductCard from "../components/ManageableProductCard.tsx";
import { Filter, Plus, Package } from "lucide-react";
import ProductModal from "../components/ProductModal";
import DeleteConfirmationModal from "../../../components/modal/DeleteConfirmationModal";
import SearchFilters from "../components/SearchFilter";
import Pagination from "../../../components/common/Pagination.tsx";

const ProductManagementPage = () => {
  const [products, setProducts] = useState<ProductWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [searchParams, setSearchParams] = useState<ProductSearchParams>({});
  const [showFilters, setShowFilters] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const [selectedProduct, setSelectedProduct] = useState<ProductWithImage | null>(null);

  const pageSize = 9;

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchParams]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts(
        currentPage,
        pageSize,
        searchParams
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

  const handleCreate = () => {
    setModalMode("create");
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product: ProductWithImage) => {
    setModalMode("edit");
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDeleteClick = (product: ProductWithImage) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    setDeleting(true);
    try {
      await productService.deleteProduct(selectedProduct.id);
      setShowDeleteModal(false);
      setSelectedProduct(null);
      await loadProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleSearch = (params: ProductSearchParams) => {
    setSearchParams(params);
    setCurrentPage(0);
  };

  const handleSuccess = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setModalMode("create");
    loadProducts();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setModalMode("create");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Product Management
                </h1>
                <p className="text-gray-600">Manage products in your catalog</p>
              </div>
            </div>

            {products.length !== 0 && (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Filter className="w-5 h-5" />
                  Filters
                </button>

                <button
                  onClick={handleCreate}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add Product
                </button>
              </div>
            )}
          </div>
        </div>
        {/* FILTERS */}
        {showFilters && (
          <SearchFilters
            onSearch={handleSearch}
            onClose={() => setShowFilters(false)}
          />
        )}
        {/* LOADING */}
        {loading && (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}
        {/* EMPTY STATE */}
        {!loading && products.length === 0 && (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first product.
            </p>
            <button
              onClick={handleCreate}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>
        )}
        {/* GRID */}
        {!loading && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {products.map((product) => (
                <ManageableProductCard
                  key={product.id}
                  product={product}
                  onEdit={() => handleEdit(product)}
                  onDelete={() => handleDeleteClick(product)}
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
        {/* CREATE / EDIT MODAL */}
        {showModal && (
          <ProductModal
            key={modalMode}
            mode={modalMode}
            product={selectedProduct}
            onClose={handleCloseModal}
            onSuccess={handleSuccess}
          />
        )}
        {/* DELETE MODAL */}
        {showDeleteModal && selectedProduct && (
          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedProduct(null);
            }}
            onConfirm={handleDeleteConfirm}
            title="Delete Product"
            message="Are you sure you want to delete this product? This action cannot be undone."
            itemName={selectedProduct.name}
            confirmText="DELETE"
            loading={deleting}
          />
        )}
      </div>
    </div>
  );
};

export default ProductManagementPage;
