import type {
    Vehicle,
    VehicleBrand,
    VehicleModel,
    VehicleResponse,
} from "../types/vehicle.types.ts";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    vehicleImagesSchema,
    vehicleSchema,
} from "../schemas/vehicleSchema.ts";
import { vehicleService } from "../../../api/services/vehicleService.ts";
import { Upload, X } from "lucide-react";
import {StatusAlert} from "../../../components/common/StatusAlert.tsx";
import AuthenticatedImage from "../../../components/auth/AuthenticatedImage.tsx";

interface VehicleModalProps {
    onSuccess: () => void;
    mode: string;
    vehicle: VehicleResponse | null;
    onClose: () => void;
}

const VehicleModal: React.FC<VehicleModalProps> = ({
                                                       mode,
                                                       vehicle,
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
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            registrationNumber: "",
            maxLoadKg: 0,
            brandId: 0,
            modelId: 0,
        },
        mode: "onChange",
    });

    const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState(
        vehicle?.imageUrls || []
    );
    const [brands, setBrands] = useState<VehicleBrand[]>([]);
    const [models, setModels] = useState<VehicleModel[]>([]);
    const [imageError, setImageError] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [createdVehicleId, setCreatedVehicleId] = useState<number | null>(null);

    const brandId = watch("brandId");

    useEffect(() => {
        const initializeForm = async () => {
            await loadBrands();

            if (vehicle && mode === "edit") {
                await loadModels(vehicle.brand.id);
                reset({
                    registrationNumber: vehicle.registrationNumber,
                    maxLoadKg: vehicle.maxLoadKg,
                    brandId: vehicle.brand.id,
                    modelId: vehicle.model.id,
                });
            }
        };

        initializeForm();
    }, [vehicle, mode, reset]);

    useEffect(() => {
        if (brandId) {
            loadModels(+brandId);
        } else {
            setModels([]);
            setValue("modelId", 0);
        }
    }, [brandId, setValue]);

    const loadBrands = async () => {
        const data = await vehicleService.getBrands();
        setBrands(data);
    };

    const loadModels = async (brandId: number) => {
        const data = await vehicleService.getModelsByBrand(brandId);
        setModels(data);
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

    const retryImageUpload = async () => {
        if (images.length === 0 || !createdVehicleId) return;

        setLoading(true);
        setSubmitStatus(null);

        try {
            const formData = new FormData();
            images.forEach((img) => formData.append("images", img));

            await vehicleService.uploadVehicleImages(createdVehicleId, formData);
            setSubmitStatus("success");
            onSuccess();
        } catch (error: any) {
            setSubmitStatus("partial-success");
            setSubmitError(error?.message || "Image upload failed again");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: Vehicle) => {
        if (mode === "create" && images.length === 0) {
            setImageError("At least one vehicle image is required");
            return;
        }

        if (images.length > 0) {
            const imageValidation = vehicleImagesSchema.safeParse({ images });
            if (!imageValidation.success) {
                const firstError = imageValidation.error;
                setImageError(firstError.message);
                return;
            }
        }

        setLoading(true);
        setSubmitStatus(null);
        setImageError("");

        try {
            if (mode === "create") {
                const result = await vehicleService.createVehicle(data, images);
                setCreatedVehicleId(result.vehicle.id ?? null);
                console.log(result);
                if (!result.imagesUploaded) {
                    setSubmitStatus("partial-success");
                    setSubmitError("Image upload failed. You can retry now or later.");
                } else {
                    setSubmitStatus("success");
                    onSuccess();
                }
            } else {
                await vehicleService.updateVehicle(vehicle!.id, data);

                if (imagesToDelete.length > 0) {
                    await vehicleService.deleteImages(vehicle!.id, imagesToDelete);
                }

                if (images.length > 0) {
                    const formData = new FormData();
                    images.forEach((img) => formData.append("images", img));

                    await vehicleService.uploadVehicleImages(vehicle!.id, formData);
                }
                setSubmitStatus("success");
                onSuccess();
            }
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
                                {mode === "create" ? "Add New Vehicle" : "Edit Vehicle"}
                            </h2>
                            <p className="text-indigo-100">
                                {mode === "create"
                                    ? "Register a new delivery vehicle"
                                    : "Update vehicle information"}
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
                    {submitStatus && (
                        <StatusAlert
                            type={submitStatus === "success" ? "success" : submitStatus === "error" ? "error" : submitStatus === "partial-success" ? "warning" : "info"}
                            message={submitStatus === "success"
                                ? "Vehicle saved successfully!"
                                : submitError || "Something went wrong!"}
                            onAction={retryImageUpload}
                            actionLabel={ submitStatus == "partial-success" ?  "Retry Upload" : undefined}
                            secondaryActionLabel={ submitStatus == "partial-success" ? "Continue" : undefined }
                            onSecondaryAction = { onSuccess }
                        />)}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Registration Plate *
                            </label>
                            <input
                                type="text"
                                {...register("registrationNumber")}
                                placeholder="e.g., BG-123-AB"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                    errors.registrationNumber
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            />
                            {errors.registrationNumber && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.registrationNumber.message}
                                </p>
                            )}
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Maximum Load Capacity (kg) *
                            </label>
                            <input
                                type="number"
                                {...register("maxLoadKg", { valueAsNumber: true })}
                                placeholder="e.g., 2500"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                    errors.maxLoadKg ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.maxLoadKg && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.maxLoadKg.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Brand *
                            </label>
                            <select
                                {...register("brandId", { valueAsNumber: true })}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                    errors.brandId ? "border-red-500" : "border-gray-300"
                                }`}
                            >
                                <option value="">Select brand</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                            {errors.brandId && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.brandId.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Model *
                            </label>
                            <select
                                {...register("modelId", { valueAsNumber: true })}
                                disabled={!brandId}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 ${
                                    errors.modelId ? "border-red-500" : "border-gray-300"
                                }`}
                            >
                                <option value="">Select model</option>
                                {models.map((model) => (
                                    <option key={model.id} value={model.id}>
                                        {model.name}
                                    </option>
                                ))}
                            </select>
                            {errors.modelId && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.modelId.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vehicle Images {mode === "create" && "*"}
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
                                id="vehicle-images"
                            />
                            <label htmlFor="vehicle-images" className="cursor-pointer">
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-sm text-gray-600">
                                    Click to upload vehicle images
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
                                            <AuthenticatedImage
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
                        ) : mode === "create" ? (
                            "Create Vehicle"
                        ) : (
                            "Update Vehicle"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VehicleModal;
