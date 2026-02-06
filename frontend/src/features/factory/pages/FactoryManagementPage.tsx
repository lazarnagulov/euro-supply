import { useEffect, useState } from "react";
import { factoryService } from "../../../api/services/factoryService.ts";
import type {
  FactoryResponse,
  FactorySearchParams,
} from "../types/factory.types.ts";
import Pagination from "../../../components/common/Pagination.tsx";
import FactoryCard from "../components/FactoryCard.tsx";
import { Filter, Plus, Factory } from "lucide-react";
import FactoryModal from "../components/FactoryModal.tsx";
import FactorySearchFilter from "../components/SearchFilter.tsx";
import DeleteConfirmationModal from "../../../components/modal/DeleteConfirmationModal.tsx";

const FactoryManagementPage = () => {
  const [factories, setFactories] = useState<FactoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchParams, setSearchParams] = useState<FactorySearchParams>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedFactory, setSelectedFactory] =
    useState<FactoryResponse | null>(null);
  const pageSize = 10;

  useEffect(() => {
    loadFactories();
  }, [currentPage, searchParams]);

  const loadFactories = async () => {
    setLoading(true);
    try {
      const data = await factoryService.getFactories(
        currentPage,
        pageSize,
        searchParams
      );
      setFactories(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Failed to load factories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode("create");
    setSelectedFactory(null);
    setShowModal(true);
  };

  const handleEdit = (factory: FactoryResponse) => {
    setModalMode("edit");
    setSelectedFactory(factory);
    setShowModal(true);
  };

  const handleDeleteClick = (factory: FactoryResponse) => {
    setSelectedFactory(factory);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedFactory) return;

    setDeleting(true);
    try {
      await factoryService.deleteFactory(selectedFactory.id);
      setShowDeleteModal(false);
      setSelectedFactory(null);
      await loadFactories();
    } catch (error) {
      console.error("Failed to delete factory:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleSearch = (params: FactorySearchParams) => {
    setSearchParams(params);
    setCurrentPage(0);
  };

  const handleSuccess = () => {
    setShowModal(false);
    loadFactories();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Factory className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Factory Management
                </h1>
                <p className="text-gray-600">Manage production facilities</p>
              </div>
            </div>
            {factories.length !== 0 && (
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
                  Add Factory
                </button>
              </div>
            )}
          </div>
        </div>

        {showFilters && (
          <FactorySearchFilter
            onSearch={handleSearch}
            onClose={() => setShowFilters(false)}
          />
        )}

        {loading && (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading factories...</p>
          </div>
        )}

        {!loading && factories.length === 0 && (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <Factory className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Factories Found
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first factory.
            </p>
            <button
              onClick={handleCreate}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Factory
            </button>
          </div>
        )}

        {!loading && factories.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {factories.map((factory) => (
                <FactoryCard
                  key={factory.id}
                  factory={factory}
                  onEdit={() => handleEdit(factory)}
                  onDelete={() => handleDeleteClick(factory)}
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

        {showModal && (
          <FactoryModal
            mode={modalMode}
            factory={selectedFactory}
            onClose={() => setShowModal(false)}
            onSuccess={handleSuccess}
          />
        )}

        {showDeleteModal && selectedFactory && (
          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedFactory(null);
            }}
            onConfirm={handleDeleteConfirm}
            title="Delete Factory"
            message="Are you sure you want to delete this factory? This action cannot be undone and all associated data will be permanently removed."
            itemName={`${selectedFactory.name} (${selectedFactory.address})`}
            confirmText="DELETE"
            loading={deleting}
          />
        )}
      </div>
    </div>
  );
};

export default FactoryManagementPage;
