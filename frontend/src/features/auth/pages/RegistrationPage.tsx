import { Upload, UserPlus, X } from "lucide-react"
import { useForm } from "react-hook-form";
import { registrationSchema, type RegistrationFormValues } from "../schema/authSchema";
import { authService } from "../../../api/services/authService";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AppToaster from "../../../components/common/AppToaster";


const RegistrationPage = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phoneNumber: "",
      username: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const [imageError, setImageError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate()

  const onSubmit = async (data: RegistrationFormValues) => {
    const { username, email, password, passwordConfirmation, firstname, lastname, phoneNumber } = data;

    if (!image) {
        setImageError("User image is required");
        return;
    }

    try {
      const response = await authService.register({
        username,
        email,
        password,
        passwordConfirmation,
        person: {
          firstname,
          lastname,
          phoneNumber,
        },
      }, image);
      
      console.log(response)
      toast.success("User registered successfully. Please check your email to verify your account.");
      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      console.log(err)
      const errorMessage = err?.message ?? "Registration failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }};

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
  
      if (!file.type.startsWith("image/")) {
        setImageError("Only image files are allowed");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setImageError("Image must be less than 10MB");
        return;
      }
  
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImageError(null);
    };

    const removeImage = () => {
      setImage(null);
      setPreviewUrl(null);
    };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md mx-auto mt-10">
      <AppToaster/>
      <div className="center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Create Account
        </h3>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            type="text"
            placeholder="First name"
            {...register("firstname")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {errors.firstname && (
            <p className="text-red-600 text-sm mt-1">{errors.firstname.message}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Last name"
            {...register("lastname")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {errors.lastname && (
            <p className="text-red-600 text-sm mt-1">{errors.lastname.message}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email address"
            {...register("email")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type="number"
            placeholder="Phone number"
            {...register("phoneNumber")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {errors.phoneNumber && (
            <p className="text-red-600 text-sm mt-1">{errors.phoneNumber.message}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Username"
            {...register("username")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {errors.username && (
            <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Confirm password"
            {...register("passwordConfirmation")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {errors.passwordConfirmation && (
            <p className="text-red-600 text-sm mt-1">{errors.passwordConfirmation.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User Image 
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
              id="product-image"
            />
            <label htmlFor="product-image" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600">
                Click to upload user image
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG up to 10MB
              </p>
            </label>
          </div>

          {previewUrl && (
            <div className="mt-4 relative w-40">
              <img
                src={previewUrl}
                alt="Product preview"
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {imageError && (
            <p className="mt-2 text-sm text-red-600">{imageError}</p>
          )}
        </div>

        {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationPage;