import type { Factory, FactoryResponse } from "../types/factory.types.ts";
import type { Country, City } from "../../../types/location.types.ts";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { factorySchema } from "../schemas/factorySchema.ts";
import { factoryService } from "../../../api/services/factoryService.ts";
import { locationService } from "../../../api/services/locationService.ts";

import {
  AlertCircle,
  CheckCircle,
  X,
  Factory as FactoryIcon,
  Upload,
} from "lucide-react";
import type { LatLngTuple } from "leaflet";
import { MapField } from "../../../components/map/MapField.tsx";

interface FactoryModalProps {
  onSuccess: () => void;
  mode: string;
  factory: FactoryResponse | null;
  onClose: () => void;
}

const FactoryModal: React.FC<FactoryModalProps> = ({
  mode,
  factory,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(factorySchema),
    defaultValues: {
      name: "",
      address: "",
      countryId: 0,
      cityId: 0,
      latitude: 0,
      longitude: 0,
    },
    mode: "onChange",
  });

  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState(
    factory?.imageUrls || []
  );
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [imageError, setImageError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const countryId = watch("countryId");
  const latitude = watch("latitude");
  const longitude = watch("longitude");

  useEffect(() => {
    const initializeForm = async () => {
      await loadCountries();

      if (factory && mode === "edit") {
        await loadCities(factory.country.id);
        reset({
          name: factory.name,
          address: factory.address,
          countryId: factory.country.id,
          cityId: factory.city.id,
          latitude: factory.latitude,
          longitude: factory.longitude,
        });
      }
    };

    initializeForm();
  }, [factory, mode, reset]);

  useEffect(() => {
    if (countryId) {
      loadCities(+countryId);
    } else {
      setCities([]);
      setValue("cityId", 0);
    }
  }, [countryId, setValue]);

  const loadCountries = async () => {
    const data = await locationService.getCountries();
    setCountries(data);
  };

  const loadCities = async (countryId: number) => {
    const data = await locationService.getCitiesByCountry(countryId);
    setCities(data);
  };

  const handleLocationSelect = (position: LatLngTuple) => {
    setValue("latitude", position[0]);
    setValue("longitude", position[1]);
  };

  const getCurrentLocation = (): LatLngTuple | null => {
    if (latitude && longitude) {
      return [latitude, longitude];
    }
    return null;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));

    if (imageFiles.length !== files.length) {
      setImageError("Only image files are allowed");
    } else {
      setImageError("");
    }

    setImages((prev) => [...prev, ...imageFiles]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageError("");
  };

  const removeExistingImage = (index: number) => {
    const imageToRemove = existingImages[index];
    setImagesToDelete((prev) => [...prev, imageToRemove.id]);
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: Factory) => {
    if (!data.latitude || !data.longitude) {
      setSubmitError("Please select a location on the map");
      return;
    }

    if (mode === "create" && images.length === 0) {
      setImageError("At least one factory image is required");
      return;
    }

    if (images.length > 0) {
      const hasInvalidFiles = images.some(
        (file) => !file.type.startsWith("image/")
      );
      if (hasInvalidFiles) {
        setImageError("Only image files are allowed");
        return;
      }

      const hasOversizedFiles = images.some(
        (file) => file.size > 10 * 1024 * 1024
      );
      if (hasOversizedFiles) {
        setImageError("Each image must be less than 10MB");
        return;
      }
    }

    setLoading(true);
    setSubmitStatus(null);
    setSubmitError(null);
    setImageError("");

    try {
      if (mode === "create") {
        await factoryService.createFactory(data, images);
      } else {
        await factoryService.updateFactory(factory!.id, data);

        if (imagesToDelete.length > 0) {
          await factoryService.deleteImages(factory!.id, imagesToDelete);
        }

        if (images.length > 0) {
          const formData = new FormData();
          images.forEach((img) => formData.append("images", img));

          await factoryService.uploadImages(factory!.id, formData);
        }
      }
      setSubmitStatus("success");
      onSuccess();
    } catch (error: any) {
      setSubmitStatus("error");
      setSubmitError(error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-100 hover:scrollbar-thumb-indigo-500">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                {mode === "create" ? "Add New Factory" : "Edit Factory"}
              </h2>
              <p className="text-indigo-100">
                {mode === "create"
                  ? "Register a new factory location"
                  : "Update factory information"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {submitStatus === "success" && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800">
                Factory {mode === "create" ? "created" : "updated"}{" "}
                successfully!
              </p>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">
                Failed to {mode === "create" ? "create" : "update"} factory.{" "}
                {submitError}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Factory Name *
              </label>
              <input
                type="text"
                {...register("name")}
                placeholder="e.g., Main Production Facility"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                {...register("address")}
                placeholder="e.g., 123 Industrial Park Rd"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  {...register("countryId", { valueAsNumber: true })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.countryId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.countryId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.countryId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <select
                  {...register("cityId", { valueAsNumber: true })}
                  disabled={!countryId}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 ${
                    errors.cityId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select city</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {errors.cityId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.cityId.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <MapField
                label="Location on Map"
                description="Click on the map to select factory location"
                required={true}
                error={errors.latitude?.message || errors.longitude?.message}
                value={getCurrentLocation()}
                onChange={handleLocationSelect}
                height="400px"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Factory Images {mode === "create" && "*"}
              </label>

              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  imageError ? "border-red-500" : "border-gray-300"
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="factory-images"
                />
                <label htmlFor="factory-images" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">
                    Click to upload factory images
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 10MB each
                  </p>
                </label>
              </div>
              {imageError && (
                <p className="mt-2 text-sm text-red-600">{imageError}</p>
              )}

              {existingImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Current Images
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {existingImages.map((fileResponse, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={fileResponse.url}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    New Images
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {images.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <p className="text-xs text-gray-600 mt-1 truncate">
                          {file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 rounded-b-2xl flex justify-end gap-4 z-10">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {mode === "create" ? "Creating..." : "Updating..."}
              </>
            ) : (
              <>
                <FactoryIcon className="w-5 h-5" />
                {mode === "create" ? "Create Factory" : "Update Factory"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FactoryModal;
