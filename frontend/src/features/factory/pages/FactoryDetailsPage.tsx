import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Factory,
  Building2,
  Globe,
  ChartBar,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { factoryService } from "../../../api/services/factoryService.ts";
import type {
  FactoryProductListItemDto,
  FactoryResponse,
} from "../types/factory.types.ts";
import { InteractiveMap } from "../../../components/map/InteractiveMap";
import { ImageModal } from "../../../components/modal/ImageModal.tsx";
import type { ConnectionStatus } from "../../../types/status.types.ts";
import { useFactoryPolling } from "../hooks/useFactoryPolling.ts";
import type { PagedResponse } from "../../../types/api.types.ts";
import { ProductStatsModal } from "../components/ProductStatsModal.tsx";
import AuthenticatedImage from "../../../components/auth/AuthenticatedImage.tsx";

const FactoryDetailsPage: React.FC = () => {
  const { factoryId } = useParams();
  const navigate = useNavigate();
  const [factory, setFactory] = useState<FactoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [factoryStatus, setFactoryStatus] = useState<ConnectionStatus | null>(
    null
  );
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState<
    string | undefined
  >(undefined);
  const [selectedProductId, setSelectedProductId] = useState<number>(0);

  const [productsPage, setProductsPage] =
    useState<PagedResponse<FactoryProductListItemDto> | null>(null);
  const [productsLoading, setProductsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  useEffect(() => {
    const loadFactory = async () => {
      if (!factoryId) return;

      setLoading(true);
      try {
        const data = await factoryService.getFactory(Number(factoryId));
        setFactory(data);
      } catch (error) {
        console.error("Failed to load factory:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFactory();
  }, [factoryId]);

  useEffect(() => {
    if (factory) {
      loadProducts(page, size);
    }
  }, [factory, page, size]);

  const loadProducts = async (page: number = 0, size: number = 10) => {
    if (!factoryId) return;
    setProductsLoading(true);
    try {
      const data = await factoryService.getProductsByFactory(
        Number(factoryId),
        page,
        size
      );
      setProductsPage(data);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setProductsLoading(false);
    }
  };

  useFactoryPolling({
    factoryId,
    onStatusUpdate: setFactoryStatus,
    enabled: !!factory,
  });

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };

  const openStatsModal = (productName: string, productId: number) => {
    setSelectedProductName(productName);
    setStatsModalOpen(true);
    setSelectedProductId(productId);
  };

  const closeStatsModal = () => {
    setStatsModalOpen(false);
    setSelectedProductName(undefined);
    setSelectedProductId(0);
  };

  const goToPreviousImage = () => {
    if (selectedImageIndex !== null && factory?.imageUrls) {
      setSelectedImageIndex(
        (selectedImageIndex - 1 + factory.imageUrls.length) %
          factory.imageUrls.length
      );
    }
  };

  const goToNextImage = () => {
    if (selectedImageIndex !== null && factory?.imageUrls) {
      setSelectedImageIndex(
        (selectedImageIndex + 1) % factory.imageUrls.length
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-12 text-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading factory...</p>
      </div>
    );
  }

  if (!factory) {
    return (
      <div className="flex flex-col items-center justify-center text-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="p-6 bg-red-100 text-red-600 rounded-full shadow-inner mb-4">
          <Factory size={48} />
        </div>
        <h2 className="text-2xl font-bold text-red-700 mb-2">
          Factory not found
        </h2>
        <p className="text-gray-600 max-w-md mb-6">
          The requested factory could not be located. It may have been removed,
          or the ID is incorrect.
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
    <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 to-teal-100 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow">
          <Factory size={40} className="text-white" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{factory.name}</h1>
            {factoryStatus && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                  factoryStatus.online
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    factoryStatus.online ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                {factoryStatus.online ? "Online" : "Offline"}
              </span>
            )}
          </div>

          <p className="text-gray-600">{factory.address}</p>
          <p className="text-gray-600">
            {factory.city.name}, {factory.country.name}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Factory size={18} /> Factory Images
        </h2>

        {(!factory.imageUrls || factory.imageUrls.length === 0) && (
          <div className="flex flex-col items-center justify-center text-center py-6">
            <div className="p-4 bg-gray-100 rounded-full mb-2">
              <Factory size={32} className="text-gray-500" />
            </div>
            <p className="text-gray-500">
              No images available for this factory.
            </p>
          </div>
        )}

        {factory.imageUrls && factory.imageUrls.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {factory.imageUrls.slice(0, 6).map((fileResponse, index) => (
                <div
                  key={`factory_${index}`}
                  className="relative group cursor-pointer rounded-xl overflow-hidden shadow-sm border"
                  onClick={() => openImageModal(index)}
                >
                  <AuthenticatedImage
                    src={fileResponse.url}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                    alt={`Factory ${index + 1}`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-medium text-sm">
                    View
                  </div>
                </div>
              ))}
            </div>
            {factory.imageUrls.length > 6 && (
              <p className="text-sm text-gray-500 italic">
                Showing 6 of {factory.imageUrls.length} images
              </p>
            )}
          </>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Building2 size={18} /> Factory Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Factory Name</p>
            <p className="font-semibold text-gray-800">{factory.name}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Address</p>
            <p className="font-semibold text-gray-800">{factory.address}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
              <Globe size={14} /> Country
            </p>
            <p className="font-semibold text-gray-800">
              {factory.country.name}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">City</p>
            <p className="font-semibold text-gray-800">{factory.city.name}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
              <MapPin size={14} /> Coordinates
            </p>
            <p className="font-semibold text-gray-800">
              {factory.latitude.toFixed(6)}, {factory.longitude.toFixed(6)}
            </p>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold mb-4">Products Produced</h2>

        {productsLoading ? (
          <div className="flex justify-center py-6">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : productsPage && productsPage.content.length > 0 ? (
          <>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 font-medium text-gray-700">
                    Product Name
                  </th>
                  <th className="py-2 px-4 font-medium text-gray-700">
                    Category
                  </th>
                  <th className="py-2 px-4 font-medium text-gray-700 text-center">
                    Statistics
                  </th>
                </tr>
              </thead>
              <tbody>
                {productsPage.content.map((prod) => (
                  <tr
                    key={prod.productId}
                    className="border-b hover:bg-gray-50"
                  >
                    <td
                      className="py-2 px-4 text-blue-600 cursor-pointer hover:underline"
                      onClick={() => navigate(`/products/${prod.productId}`)}
                    >
                      {prod.productName}
                    </td>
                    <td className="py-2 px-4">{prod.categoryName}</td>
                    <td className="py-2 px-4 text-center">
                      <button
                        className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                        onClick={() =>
                          openStatsModal(prod.productName, prod.productId)
                        }
                        title="View Stats"
                      >
                        <ChartBar size={16} />
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
                  disabled={page + 1 >= productsPage.totalPages}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </button>
                <span className="text-gray-700 ml-2">
                  Page {page + 1} of {productsPage.totalPages}
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
          <p className="text-gray-500 py-4">
            No products found for this factory.
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MapPin size={18} /> Factory Location
        </h2>

        <InteractiveMap
          center={[factory.latitude, factory.longitude]}
          selectedPosition={[factory.latitude, factory.longitude]}
          readOnly={true}
          height="500px"
        />
      </div>

      <div className="p-0 space-y-0">
        <ImageModal
          images={factory?.imageUrls || []}
          selectedIndex={selectedImageIndex}
          onClose={closeImageModal}
          onPrevious={goToPreviousImage}
          onNext={goToNextImage}
        />
      </div>
      <div className="p-0 space-y-0">
        <ProductStatsModal
          open={statsModalOpen}
          onClose={closeStatsModal}
          productName={selectedProductName}
          productId={selectedProductId}
          factoryId={factory.id}
        />
      </div>
    </div>
  );
};

export default FactoryDetailsPage;
