import type { RegistrationRequest } from "../../auth/types/auth.types.ts";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registrationSchema,
  type RegistrationFormValues,
} from "../../auth/schema/authSchema.ts";
import { managerService } from "../../../api/services/managerService.ts";
import { X, User } from "lucide-react";
import { StatusAlert } from "../../../components/common/StatusAlert.tsx";

interface ManagerModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

const ManagerModal: React.FC<ManagerModalProps> = ({ onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      firstname: "",
      lastname: "",
      phoneNumber: "",
    },
    mode: "onChange",
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageError, setImageError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // const password = watch("password");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        setImageError("Only image files are allowed");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setImageError("Image size must be less than 10MB");
        return;
      }

      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setImageError("");
    }
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImage(null);
    setImagePreview("");
    setImageError("");
  };

  const onSubmit = async (data: RegistrationFormValues) => {
    if (!image) {
      setImageError("Manager profile image is required");
      return;
    }

    setLoading(true);
    setSubmitStatus(null);
    setImageError("");

    try {
      const requestData: RegistrationRequest = {
        username: data.username,
        email: data.email,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
        person: {
          firstname: data.firstname,
          lastname: data.lastname,
          phoneNumber: data.phoneNumber,
          imageUrl: null as any,
        },
      };

      await managerService.createManager(requestData, image);
      setSubmitStatus("success");
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error: any) {
      setSubmitStatus("error");
      setSubmitError(
        error?.message || "Failed to create manager. Please try again.",
      );
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
              <h2 className="text-2xl font-bold">Add New Manager</h2>
              <p className="text-indigo-100">Register a new manager account</p>
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
              type={submitStatus === "success" ? "success" : "error"}
              message={
                submitStatus === "success"
                  ? "Manager created successfully!"
                  : submitError || "Something went wrong!"
              }
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Account Information
              </h3>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <input
                type="text"
                {...register("username")}
                placeholder="e.g., jdoe"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="e.g., john.doe@example.com"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                {...register("passwordConfirmation")}
                placeholder="••••••••"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.passwordConfirmation
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.passwordConfirmation && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.passwordConfirmation.message}
                </p>
              )}
            </div>

            <div className="col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Personal Information
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                {...register("firstname")}
                placeholder="e.g., John"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.firstname ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.firstname && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.firstname.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                {...register("lastname")}
                placeholder="e.g., Doe"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.lastname ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.lastname && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.lastname.message}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                {...register("phoneNumber")}
                placeholder="e.g., +381 60 123 4567"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image *
            </label>

            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                imageError ? "border-red-500" : "border-gray-300"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="manager-image"
              />
              <label htmlFor="manager-image" className="cursor-pointer">
                {imagePreview ? (
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-32 h-32 object-cover rounded-full border-4 border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          removeImage();
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                      Click to change image
                    </p>
                  </div>
                ) : (
                  <>
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">
                      Click to upload profile image
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </>
                )}
              </label>
            </div>
            {imageError && (
              <p className="mt-2 text-sm text-red-600">{imageError}</p>
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
                Creating...
              </>
            ) : (
              "Create Manager"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerModal;
