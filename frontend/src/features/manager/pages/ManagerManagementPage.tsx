import { useEffect, useState } from "react";
import { managerService } from "../../../api/services/managerService";
import type {
  ManagerResponse,
  ManagerSearchParams,
} from "../types/manager.types";
import { Users, Plus, Ban, Mail, Phone } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import ManagerModal from "../components/ManagerModal";
import SuspendConfirmationModal from "../components/SuspendConfirmationModal.tsx";
import Pagination from "../../../components/common/Pagination.tsx";
import toast from "react-hot-toast";

const ManagerManagementPage = () => {
  const [managers, setManagers] = useState<ManagerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchParams /*, setSearchParams*/] = useState<ManagerSearchParams>(
    {},
  );

  const [showModal, setShowModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  const [selectedManager, setSelectedManager] =
    useState<ManagerResponse | null>(null);

  const pageSize = 10;

  useEffect(() => {
    loadManagers();
  }, [currentPage, searchParams]);

  const loadManagers = async () => {
    setLoading(true);
    try {
      const data = await managerService.getManagers(
        currentPage,
        pageSize,
        searchParams,
      );
      setManagers(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      toast.error("Failed to load managers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setShowModal(true);
  };

  const handleSuspendClick = (manager: ManagerResponse) => {
    setSelectedManager(manager);
    setShowSuspendModal(true);
  };

  const handleSuspendConfirm = async () => {
    if (!selectedManager) return;

    setDeleting(true);
    try {
      await managerService.suspendManager(selectedManager.id);
      setShowSuspendModal(false);
      setSelectedManager(null);
      await loadManagers();
    } catch (error) {
      toast.error("Failed to suspend manager. Error: " + error);
    } finally {
      setDeleting(false);
    }
  };

  const handleSuccess = () => {
    setShowModal(false);
    loadManagers();
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Manager Management
                </h1>
                <p className="text-gray-600">Manage system managers</p>
              </div>
            </div>

            <button
              onClick={handleCreate}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Manager
            </button>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading managers...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && managers.length === 0 && (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Managers Found
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first manager.
            </p>
            <button
              onClick={handleCreate}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Manager
            </button>
          </div>
        )}

        {/* TABLE */}
        {!loading && managers.length > 0 && (
          <>
            <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Profile
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Username
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {managers.map((manager) => (
                      <tr
                        key={manager.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="w-12 h-12 rounded-full border-2 border-indigo-200 flex items-center justify-center overflow-hidden">
                            {manager.imageUrl?.url ? (
                              <img
                                src={manager.imageUrl.url}
                                alt={`${manager.firstname} ${manager.lastname}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FaUserCircle className="w-10 h-10 text-indigo-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {manager.firstname} {manager.lastname}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-700">
                            @{manager.username}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              {manager.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              {manager.phoneNumber}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleSuspendClick(manager)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Suspend manager"
                            >
                              <Ban className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

        {/* CREATE MODAL */}
        {showModal && (
          <ManagerModal onClose={handleCloseModal} onSuccess={handleSuccess} />
        )}

        {showSuspendModal && selectedManager && (
          <SuspendConfirmationModal
            isOpen={showSuspendModal}
            onClose={() => {
              setShowSuspendModal(false);
              setSelectedManager(null);
            }}
            onConfirm={handleSuspendConfirm}
            userName="Suspend Manager"
            message="Are you sure you want to suspend this manager? This action cannot be undone."
            itemName={`${selectedManager.firstname} ${selectedManager.lastname}`}
            confirmText="SUSPEND"
            loading={deleting}
          />
        )}
      </div>
    </div>
  );
};

export default ManagerManagementPage;
