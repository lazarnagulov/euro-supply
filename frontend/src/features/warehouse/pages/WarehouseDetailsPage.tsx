import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Warehouse,
  Building2,
  Globe,
  Thermometer,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { warehouseService } from "../../../api/services/warehouseService.ts";
import type {
  WarehouseSectors,
  WarehouseResponse,
} from "../types/warehouse.type.ts";
import { InteractiveMap } from "../../../components/map/InteractiveMap";
import { ImageModal } from "../../../components/modal/ImageModal.tsx";
import type { ConnectionStatus } from "../../../types/status.types.ts";
import { useWarehousePolling } from "../hooks/useWarehousePolling.ts";
import type { PagedResponse } from "../../../types/api.types.ts";
import { SectorStatsModal } from "../components/SectorStatsModal.tsx";
import AuthenticatedImage from "../../../components/auth/AuthenticatedImage.tsx";

const WarehouseDetailsPage: React.FC = () => {
  const { warehouseId } = useParams();
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState<WarehouseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [warehouseStatus, setWarehouseStatus] = useState<ConnectionStatus | null>(null);

  const [tempModalOpen, setTempModalOpen] = useState(false);
  const [selectedSectorName, setSelectedSectorName] = useState<string | undefined>(undefined);
  const [selectedSectorId, setSelectedSectorId] = useState<number>(0);

  const [sectorsPage, setSectorsPage] = useState<PagedResponse<WarehouseSectors> | null>(null);
  const [sectorsLoading, setSectorsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  useEffect(() => {
    const loadWarehouse = async () => {
      if (!warehouseId) return;
      setLoading(true);
      try {
        const data = await warehouseService.getWarehouse(Number(warehouseId));
        setWarehouse(data);
      } catch (error) {
        console.error("Failed to load warehouse:", error);
      } finally {
        setLoading(false);
      }
    };
    loadWarehouse();
  }, [warehouseId]);

  useEffect(() => {
    if (warehouse) {
      loadSectors(page, size);
    }
  }, [warehouse, page, size]);

  const loadSectors = async (page: number = 0, size: number = 10) => {
    if (!warehouseId) return;
    setSectorsLoading(true);

    try {
      const data = await warehouseService.getSectorsByWarehouse(
        Number(warehouseId),
        page,
        size
      );

      setSectorsPage(data);
    } catch (err) {
      console.error("Failed to load sectors", err);
    } finally {
      setSectorsLoading(false);
    }
  };

  useWarehousePolling({
    warehouseId,
    onStatusUpdate: setWarehouseStatus,
    enabled: !!warehouse,
  });

  const openImageModal = (index: number) => setSelectedImageIndex(index);
  const closeImageModal = () => setSelectedImageIndex(null);

  const openTempModal = (sectorName: string, sectorId: number) => {
    setSelectedSectorName(sectorName);
    setSelectedSectorId(sectorId);
    setTempModalOpen(true);
  };

  const closeTempModal = () => {
    setTempModalOpen(false);
    setSelectedSectorName(undefined);
    setSelectedSectorId(0);
  };

  const goToPreviousImage = () => {
    if (selectedImageIndex !== null && warehouse?.imageUrls) {
      setSelectedImageIndex(
        (selectedImageIndex - 1 + warehouse.imageUrls.length) %
          warehouse.imageUrls.length
      );
    }
  };

  const goToNextImage = () => {
    if (selectedImageIndex !== null && warehouse?.imageUrls) {
      setSelectedImageIndex(
        (selectedImageIndex + 1) % warehouse.imageUrls.length
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-12 text-center">
        <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading warehouse...</p>
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="flex flex-col items-center justify-center text-center min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 py-8 px-4">
        <div className="p-6 bg-red-100 text-red-600 rounded-full shadow-inner mb-4">
          <Warehouse size={48} />
        </div>
        <h2 className="text-2xl font-bold text-red-700 mb-2">
          Warehouse not found
        </h2>
        <p className="text-gray-600 max-w-md mb-6">
          The requested warehouse could not be located. It may have been
          removed, or the ID is incorrect.
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
    <div className="p-6 space-y-6 bg-gradient-to-br from-teal-50 to-cyan-100 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-4 rounded-2xl shadow">
          <Warehouse size={40} className="text-white" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{warehouse.name}</h1>
            {warehouseStatus && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                  warehouseStatus.online
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    warehouseStatus.online ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                {warehouseStatus.online ? "Online" : "Offline"}
              </span>
            )}
          </div>
          <p className="text-gray-600">{warehouse.address}</p>
          <p className="text-gray-600">
            {warehouse.city.name}, {warehouse.country.name}
          </p>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Warehouse size={18} /> Warehouse Images
        </h2>

        {(!warehouse.imageUrls || warehouse.imageUrls.length === 0) ? (
          <div className="flex flex-col items-center justify-center text-center py-6">
            <div className="p-4 bg-gray-100 rounded-full mb-2">
              <Warehouse size={32} className="text-gray-500" />
            </div>
            <p className="text-gray-500">No images available for this warehouse.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {warehouse.imageUrls.slice(0, 6).map((fileResponse, index) => (
                <div
                  key={`warehouse_${index}`}
                  className="relative group cursor-pointer rounded-xl overflow-hidden shadow-sm border"
                  onClick={() => openImageModal(index)}
                >
                  <AuthenticatedImage
                    src={fileResponse.url}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                    alt={`Warehouse ${index + 1}`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-medium text-sm">
                    View
                  </div>
                </div>
              ))}
            </div>
            {warehouse.imageUrls.length > 6 && (
              <p className="text-sm text-gray-500 italic">
                Showing 6 of {warehouse.imageUrls.length} images
              </p>
            )}
          </>
        )}
      </div>

      {/* Warehouse Info */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Building2 size={18} /> Warehouse Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Warehouse Name</p>
            <p className="font-semibold text-gray-800">{warehouse.name}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Address</p>
            <p className="font-semibold text-gray-800">{warehouse.address}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
              <Globe size={14} /> Country
            </p>
            <p className="font-semibold text-gray-800">{warehouse.country.name}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">City</p>
            <p className="font-semibold text-gray-800">{warehouse.city.name}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
              <MapPin size={14} /> Coordinates
            </p>
            <p className="font-semibold text-gray-800">
              {warehouse.latitude.toFixed(6)}, {warehouse.longitude.toFixed(6)}
            </p>
          </div>
        </div>
      </div>

      {/* Sectors Table */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold mb-4 text-left">Warehouse Sectors</h2>

        {sectorsLoading ? (
          <div className="flex justify-center py-6">
            <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : sectorsPage && sectorsPage.content.length > 0 ? (
          <>
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 font-medium text-gray-700 text-left">Sector Name</th>
                  <th className="py-2 px-4 font-medium text-gray-700 text-left">Last temperature</th>
                  <th className="py-2 px-4 font-medium text-gray-700 text-left">Temperature</th>
                </tr>
              </thead>
              <tbody>
                {sectorsPage.content.map((sector) => (
                  <tr key={sector.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 font-medium text-gray-800 text-left">
                      {sector.name}
                    </td>
                    <td className="py-2 px-4 text-left font-medium text-gray-800">
                        {sector.lastTemperature != null
                        ? `${sector.lastTemperature.toFixed(1)}°C`
                        : "-"}
                    </td>
                    <td className="py-2 px-4 text-left">
                      <button
                        className="p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition"
                        onClick={() =>
                          openTempModal(sector.name, sector.id)
                        }
                        title="View Temperature Stats"
                      >
                        <Thermometer size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end items-center gap-4 mt-4 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 0}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  Prev
                </button>
                <button
                  disabled={page + 1 >= sectorsPage.totalPages}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </button>
                <span className="text-gray-700 ml-2">
                  Page {page + 1} of {sectorsPage.totalPages}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-gray-600 text-sm">Items per page:</label>
                <select
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="border rounded px-2 py-1"
                >
                  {[5, 10, 20, 50].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-500 py-4">No sectors found for this warehouse.</p>
        )}
      </div>

      {/* Map */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MapPin size={18} /> Warehouse Location
        </h2>
        <InteractiveMap
          center={[warehouse.latitude, warehouse.longitude]}
          selectedPosition={[warehouse.latitude, warehouse.longitude]}
          readOnly={true}
          height="500px"
        />
      </div>

      {/* Modals */}
      <div className="p-0 space-y-0">
        <ImageModal
          images={warehouse?.imageUrls || []}
          selectedIndex={selectedImageIndex}
          onClose={closeImageModal}
          onPrevious={goToPreviousImage}
          onNext={goToNextImage}
        />
      </div>
      <div className="p-0 space-y-0">
        <SectorStatsModal
          open={tempModalOpen}
          onClose={closeTempModal}
          sectorName={selectedSectorName}
          sectorId={selectedSectorId}
          warehouseId={warehouse.id}
        />
      </div>
    </div>
  );
};

export default WarehouseDetailsPage;