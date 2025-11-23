import React, { useState } from 'react';
import { Upload, X, Building2, ImagePlus, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import {useCompanyForm} from "../hooks/useCompanyForm.tsx";
import type {LatLngTuple} from "leaflet";
import {MapField} from "../../../components/map/MapField.tsx";
import {useCompanySubmit} from "../hooks/useCompanySubmit.tsx";
import type {Company} from "../../../types/company.types.ts";

interface CompanyFormProps {
    onSuccess?: (company: Company) => void;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({ onSuccess }) => {
    const {
        register,
        handleSubmit,
        errors,
        countries,
        cities,
        isLoadingCountries,
        isLoadingCities,
        setLocation,
        getLocation,
        reset,
    } = useCompanyForm();

    const {isLoading, isSuccess, isError, error: submitError, submitCompany } = useCompanySubmit();

    const [companyImages, setCompanyImages] = useState<File[]>([]);
    const [documents, setDocuments] = useState<File[]>([]);
    const [fileErrors, setFileErrors] = useState<{ images?: string; documents?: string }>({});

    const handleLocationSelect = (position: LatLngTuple) => {
        setLocation(position[0], position[1]);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'images' | 'documents') => {
        const files = Array.from(e.target.files || []);

        if (type === 'images') {
            const imageFiles = files.filter(f => f.type.startsWith('image/'));
            if (imageFiles.length !== files.length) {
                setFileErrors(prev => ({ ...prev, images: 'Only image files are allowed' }));
            } else {
                setFileErrors(prev => ({ ...prev, images: undefined }));
            }
            setCompanyImages(prev => [...prev, ...imageFiles]);
        } else {
            const validFiles = files.filter(f =>
                f.type === 'application/pdf' || f.type.startsWith('image/')
            );
            if (validFiles.length !== files.length) {
                setFileErrors(prev => ({ ...prev, documents: 'Only PDF and image files are allowed' }));
            } else {
                setFileErrors(prev => ({ ...prev, documents: undefined }));
            }
            setDocuments(prev => [...prev, ...validFiles]);
        }
    };

    const removeFile = (index: number, type: 'images' | 'documents') => {
        if (type === 'images') {
            setCompanyImages(prev => prev.filter((_, i) => i !== index));
        } else {
            setDocuments(prev => prev.filter((_, i) => i !== index));
        }
    };

    const onSubmit = async (data: any) => {
        const newFileErrors: { images?: string; documents?: string } = {};
        if (companyImages.length === 0) {
            newFileErrors.images = 'Please upload at least one company image';
        }
        if (documents.length === 0) {
            newFileErrors.documents = 'Please upload at least one ownership document';
        }
        setFileErrors(newFileErrors);

        if (Object.keys(newFileErrors).length > 0) {
            return;
        }

        const result = await submitCompany(data, { companyImages, documents });

        if (result.success && result.data) {
            reset();
            setCompanyImages([]);
            setDocuments([]);
            setFileErrors({});

            if (onSuccess) {
                onSuccess(result.data);
            }
        }
    };

    const currentLocation = getLocation();

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-8 h-8 text-indigo-600" />
                <h1 className="text-3xl font-bold text-gray-800">Register Your Company</h1>
            </div>

            {isSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-800">
                        Company registration submitted successfully! Your request is pending review.
                    </p>
                </div>
            )}

            {isError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-800">{submitError || 'Failed to submit registration. Please try again.'}</p>
                </div>
            )}

            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Name *
                            </label>
                            <input
                                type="text"
                                {...register('name')}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter company name"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address *
                            </label>
                            <input
                                type="text"
                                {...register('address')}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                    errors.address ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter company address"
                            />
                            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Country *
                            </label>
                            <select
                                {...register('countryId', { valueAsNumber: true })}
                                disabled={isLoadingCountries}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 ${
                                    errors.countryId ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Select a country</option>
                                {countries.map(country => (
                                    <option key={country.id} value={country.id}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                            {errors.countryId && <p className="mt-1 text-sm text-red-600">{errors.countryId.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                City *
                            </label>
                            <select
                                {...register('cityId', { valueAsNumber: true })}
                                disabled={isLoadingCities || cities.length === 0}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 ${
                                    errors.cityId ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Select a city</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.id}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                            {errors.cityId && <p className="mt-1 text-sm text-red-600">{errors.cityId.message}</p>}
                        </div>
                    </div>
                </section>

                <section>
                    <MapField
                        label="Location on Map"
                        description="Click on the map to select your company location"
                        required={true}
                        error={errors.latitude?.message || errors.longitude?.message}
                        value={currentLocation}
                        onChange={handleLocationSelect}
                        height="400px"
                    />
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <ImagePlus className="w-5 h-5" />
                        Company Images *
                    </h2>
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                        fileErrors.images ? 'border-red-500' : 'border-gray-300'
                    }`}>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'images')}
                            className="hidden"
                            id="company-images"
                        />
                        <label htmlFor="company-images" className="cursor-pointer">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm text-gray-600">Click to upload company images</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
                        </label>
                    </div>
                    {fileErrors.images && <p className="mt-2 text-sm text-red-600">{fileErrors.images}</p>}

                    {companyImages.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {companyImages.map((file, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Company ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index, 'images')}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Ownership Documents *
                    </h2>
                    <p className="text-sm text-gray-600 mb-3">Upload proof of ownership (PDFs or images)</p>
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                        fileErrors.documents ? 'border-red-500' : 'border-gray-300'
                    }`}>
                        <input
                            type="file"
                            multiple
                            accept="application/pdf,image/*"
                            onChange={(e) => handleFileUpload(e, 'documents')}
                            className="hidden"
                            id="ownership-docs"
                        />
                        <label htmlFor="ownership-docs" className="cursor-pointer">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm text-gray-600">Click to upload ownership documents</p>
                            <p className="text-xs text-gray-500 mt-1">PDF or images up to 10MB each</p>
                        </label>
                    </div>
                    {fileErrors.documents && <p className="mt-2 text-sm text-red-600">{fileErrors.documents}</p>}

                    {documents.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {documents.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-gray-600" />
                                        <span className="text-sm text-gray-700">{file.name}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index, 'documents')}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isLoading}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Registration'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};