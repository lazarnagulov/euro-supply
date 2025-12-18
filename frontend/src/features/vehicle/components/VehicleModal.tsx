import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleSchema } from "../schemas/vehicleSchema.ts";
import { vehicleService } from "../../../api/services/vehicleService.ts";
import { StatusAlert } from "../../../components/common/StatusAlert.tsx";
import { ImageUpload } from "../../../components/file/ImageUpload.tsx";
import { useVehicleBrandData } from "../hooks/useVehicleBrandData.tsx";
import { useImageManagement } from "../../../hooks/file/useImageManagement.tsx";
import { ModalHeader } from "./VehicleModalHeader.tsx";
import { FormField } from "../../../components/common/FormField.tsx";
import { ModalFooter } from "./VehicleModalFooter.tsx";
import type {Vehicle, VehicleResponse} from "../types/vehicle.types.ts";

export type SubmitStatus = "success" | "error" | "partial-success" | null;

export interface VehicleModalProps {
    onSuccess: () => void;
    mode: "create" | "edit";
    vehicle: VehicleResponse | null;
    onClose: () => void;
}

const VehicleModal: React.FC<VehicleModalProps> = ({
    mode,
    vehicle,
    onClose,
    onSuccess
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

    const { brands, models, setModels, loadBrands, loadModels } = useVehicleBrandData();
    const {
        images,
        setImages,
        existingImages,
        imageError,
        setImageError,
        handleImageUpload,
        removeImage,
        removeExistingImage,
        validateImages,
    } = useImageManagement(vehicle);

    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);
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

    const retryImageUpload = async () => {
        if (images.length === 0 || !createdVehicleId) return;

        setLoading(true);
        setSubmitStatus(null);
        setImageError("");

        try {
            const formData = new FormData();
            images.forEach((img) => formData.append("images", img));

            await vehicleService.uploadVehicleImages(createdVehicleId, formData);
            setSubmitStatus("success");
            setImages([]);
            onSuccess();
        } catch (error: any) {
            setSubmitStatus("partial-success");
            setSubmitError(error?.message || "Image upload failed again");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: Vehicle) => {
        if (!validateImages(mode)) return;

        setLoading(true);
        setSubmitStatus(null);
        setImageError("");

        try {
            if (mode === "create") {
                const result = await vehicleService.createVehicle(data, images);
                setCreatedVehicleId(result.vehicle.id || vehicle?.id || null);

                if (!result.imagesUploaded) {
                    setSubmitStatus("partial-success");
                    setSubmitError("Image upload failed. You can retry now or later.");
                } else {
                    setSubmitStatus("success");
                    onSuccess();
                }
            } else {
                await vehicleService.updateVehicle(vehicle!.id, data);
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
                <ModalHeader mode={mode} onClose={onClose} />

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            label="Registration Plate"
                            required
                            error={errors.registrationNumber?.message}
                        >
                            <input
                                type="text"
                                {...register("registrationNumber")}
                                placeholder="e.g., BG-123-AB"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                    errors.registrationNumber ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                        </FormField>

                        <FormField
                            label="Maximum Load Capacity (kg)"
                            required
                            error={errors.maxLoadKg?.message}
                        >
                            <input
                                type="number"
                                {...register("maxLoadKg", { valueAsNumber: true })}
                                placeholder="e.g., 2500"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                    errors.maxLoadKg ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                        </FormField>

                        <FormField label="Brand" required error={errors.brandId?.message}>
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
                        </FormField>

                        <FormField label="Model" required error={errors.modelId?.message}>
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
                        </FormField>
                    </div>

                    <ImageUpload
                        images={images}
                        existingImages={existingImages}
                        imageError={imageError}
                        mode={mode}
                        onImageUpload={handleImageUpload}
                        onRemoveImage={removeImage}
                        onRemoveExistingImage={removeExistingImage}
                    />
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
                </div>

                <ModalFooter
                    mode={mode}
                    loading={loading}
                    onClose={onClose}
                    onSubmit={handleSubmit(onSubmit)}
                />
            </div>
        </div>
    );
};

export default VehicleModal;
