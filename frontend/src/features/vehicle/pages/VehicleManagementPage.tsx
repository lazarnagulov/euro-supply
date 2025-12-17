import {useEffect, useState} from "react";
import {vehicleService} from "../../../api/services/vehicleService.ts";
import type {VehicleResponse, VehicleSearchParams} from "../types/vehicle.types.ts";
import Pagination from "../../../components/common/Pagination.tsx";
import VehicleCard from "../components/VehicleCard.tsx";
import {Filter, Plus, Truck} from "lucide-react";
import VehicleModal from "../components/VehicleModal.tsx";
import SearchFilters from "../components/SearchFilter.tsx";
import DeleteConfirmationModal from "../../../components/modal/DeleteConfirmationModal.tsx";

const VehicleManagementPage = () => {
    const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchParams, setSearchParams] = useState<VehicleSearchParams>({});
    const [showFilters, setShowFilters] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleResponse | null>(null);
    const pageSize = 10;

    useEffect(() => {
        loadVehicles();
    }, [currentPage, searchParams]);

    const loadVehicles = async () => {
        setLoading(true);
        try {
            const data = await vehicleService.getVehicles(currentPage, pageSize, searchParams);
            setVehicles(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (error) {
            console.error('Failed to load vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setModalMode('create');
        setSelectedVehicle(null);
        setShowModal(true);
    };

    const handleEdit = (vehicle: VehicleResponse) => {
        setModalMode('edit');
        setSelectedVehicle(vehicle);
        setShowModal(true);
    };

    const handleDeleteClick = (vehicle: VehicleResponse) => {
        setSelectedVehicle(vehicle);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedVehicle) return;

        setDeleting(true);
        try {
            await vehicleService.deleteVehicle(selectedVehicle.id);
            setShowDeleteModal(false);
            setSelectedVehicle(null);
            await loadVehicles();
        } catch (error) {
            console.error('Failed to delete vehicle:', error);
        } finally {
            setDeleting(false);
        }
    };

    const handleSearch = (params: VehicleSearchParams) => {
        setSearchParams(params);
        setCurrentPage(0);
    };

    const handleSuccess = () => {
        setShowModal(false);
        loadVehicles();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Truck className="w-8 h-8 text-indigo-600" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Vehicle Management</h1>
                                <p className="text-gray-600">Manage delivery vehicles</p>
                            </div>
                        </div>
                        {vehicles.length !== 0 && (
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
                                Add Vehicle
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
                        <p className="text-gray-600">Loading vehicles...</p>
                    </div>
                )}

                {!loading && vehicles.length === 0 && (
                    <div className="bg-white rounded-xl shadow p-12 text-center">
                        <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Vehicles Found</h3>
                        <p className="text-gray-600 mb-4">Get started by adding your first vehicle.</p>
                        <button
                            onClick={handleCreate}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Vehicle
                        </button>
                    </div>
                )}

                {!loading && vehicles.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            {vehicles.map(vehicle => (
                                <VehicleCard
                                    key={vehicle.id}
                                    vehicle={vehicle}
                                    onEdit={() => handleEdit(vehicle)}
                                    onDelete={() => handleDeleteClick(vehicle)}
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
                    <VehicleModal
                        mode={modalMode}
                        vehicle={selectedVehicle}
                        onClose={() => setShowModal(false)}
                        onSuccess={handleSuccess}
                    />
                )}

                {showDeleteModal && selectedVehicle && (
                    <DeleteConfirmationModal
                        isOpen={showDeleteModal}
                        onClose={() => {
                            setShowDeleteModal(false);
                            setSelectedVehicle(null);
                        }}
                        onConfirm={handleDeleteConfirm}
                        title="Delete Vehicle"
                        message="Are you sure you want to delete this vehicle? This action cannot be undone and all associated data will be permanently removed."
                        itemName={`${selectedVehicle.brand.name} ${selectedVehicle.model.name} (${selectedVehicle.registrationNumber})`}
                        confirmText="DELETE"
                        loading={deleting}
                    />
                )}
            </div>
        </div>
    );
};

export default VehicleManagementPage;