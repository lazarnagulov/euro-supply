import { useEffect, useState } from "react";
import type { WarehouseResponse, WarehouseSearchParams } from "../types/warehouse.type";
import { warehouseService } from "../../../api/services/warehouseService"
import Pagination from "../../../components/common/Pagination";
import { Warehouse, Plus, Filter } from "lucide-react";
import DeleteConfirmationModal from "../../../components/modal/DeleteConfirmationModal";
import WarehouseCard from "../components/WarehouseCard";
import WarehouseModal from "../components/WarehouseModal";
import SearchFilters from "../components/SearchFilter";

const WarehouseManagementPage = () => {

  const [warehouses, setWarehouses] = useState<WarehouseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseResponse | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [deleting, setDeleting] = useState(false);
  const [searchParams, setSearchParams] = useState<WarehouseSearchParams>({});
  const pageSize = 10;

  useEffect(() => {
        loadWarehouses();
    }, [currentPage, searchParams]);

  const loadWarehouses = async () => {
        setLoading(true);
        try {
          const data = await warehouseService.getWarehouses(currentPage, pageSize, searchParams);
          setWarehouses(data.content)
          setTotalPages(data.totalPages)
          setTotalElements(data.totalElements)
        } catch (error) {
          console.error('Failed to load warehouses', error)
        } finally {
          setLoading(false)
        }
  }

  const handleCreate = () => {
          setModalMode('create');
          setSelectedWarehouse(null);
          setShowModal(true);
      };
  
      const handleEdit = (warehouse: WarehouseResponse) => {
          setModalMode('edit');
          setSelectedWarehouse(warehouse);
          setShowModal(true);
      };
  
      const handleDeleteClick = (warehouse: WarehouseResponse) => {
          setSelectedWarehouse(warehouse);
          setShowDeleteModal(true);
      };
  
      const handleDeleteConfirm = async () => {
          if (!selectedWarehouse) return;
  
          setDeleting(true);
          try {
              await warehouseService.deleteWarehouse(selectedWarehouse.id);
              setShowDeleteModal(false);
              setSelectedWarehouse(null);
              await loadWarehouses();
          } catch (error) {
              console.error('Failed to delete warehouse:', error);
          } finally {
              setDeleting(false);
          }
      };
  
      const handleSearch = (params: WarehouseSearchParams) => {
          setSearchParams(params);
          setCurrentPage(0);
      };
  
      const handleSuccess = () => {
          setShowModal(false);
          loadWarehouses();
      };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Warehouse className="w-8 h-8 text-indigo-600" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Warehouse Management</h1>
                                <p className="text-gray-600">Manage warehouses</p>
                            </div>
                        </div>
                        {warehouses.length !== 0 && (
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
                                Add Warehouse
                            </button>
                        </div>
                        )}
                    </div>
                </div>

                {showFilters && (
                    <SearchFilters onSearch={handleSearch} onClose={() => setShowFilters(false)} />
                )}

                {loading && (
                    <div className="bg-white rounded-xl shadow p-12 text-center">
                        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading warehouses...</p>
                    </div>
                )}

                {!loading && warehouses.length === 0 && (
                    <div className="bg-white rounded-xl shadow p-12 text-center">
                        <Warehouse className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Warehouse Found</h3>
                        <p className="text-gray-600 mb-4">Get started by adding your first warehouse.</p>
                        <button
                            onClick={handleCreate}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Add Warehouse
                        </button>
                    </div>
                )}

                {!loading && warehouses.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            {warehouses.map(warehouse => (
                                <WarehouseCard
                                    key={warehouse.id}
                                    warehouse={warehouse}
                                    onEdit={() => handleEdit(warehouse)}
                                    onDelete={() => handleDeleteClick(warehouse)}
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
                    <WarehouseModal
                        mode={modalMode}
                        warehouse={selectedWarehouse}
                        onClose={() => setShowModal(false)}
                        onSuccess={handleSuccess}
                    />
                )} 

                {showDeleteModal && selectedWarehouse && (
                    <DeleteConfirmationModal
                        isOpen={showDeleteModal}
                        onClose={() => {
                            setShowDeleteModal(false);
                            setSelectedWarehouse(null);
                        }}
                        onConfirm={handleDeleteConfirm}
                        title="Delete Warehouse"
                        message="Are you sure you want to delete this warehouse? This action cannot be undone and all associated data will be permanently removed."
                        itemName={`${selectedWarehouse.name}`}
                        confirmText="DELETE"
                        loading={deleting}
                    />
                )}
            </div>
        </div>

  )
}

export default WarehouseManagementPage;