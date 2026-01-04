import React, { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Factory, Building2, Globe } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { factoryService } from "../../../api/services/factoryService.ts";
import type { FactoryResponse } from "../types/factory.types.ts";
import { InteractiveMap } from "../../../components/map/InteractiveMap";
import { ImageModal } from "../../../components/modal/ImageModal.tsx";

const FactoryDetailsPage: React.FC = () => {
  const { factoryId } = useParams();
  const navigate = useNavigate();
  const [factory, setFactory] = useState<FactoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

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

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
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
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
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
          <h1 className="text-2xl font-bold">{factory.name}</h1>
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
                  <img
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
    </div>
  );
};

export default FactoryDetailsPage;
