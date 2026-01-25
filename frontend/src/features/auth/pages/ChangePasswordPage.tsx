import { KeyRound, Building2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import apiClient from "../../../api/client";

type ChangePasswordFormValues = {
  userId: number;
  oldPassword: string;
  newPassword: string;
  passwordConfirmation: string;
};

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userIdFromState = (location.state as any)?.userId ?? 0;

  useEffect(() => {
    if (!userIdFromState) {
      navigate("/login");
    }
  }, [userIdFromState, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      userId: userIdFromState,
      oldPassword: "",
      newPassword: "",
      passwordConfirmation: "",
    },
  });

  const newPassword = watch("newPassword");

  useEffect(() => {
    if (userIdFromState) {
      setValue("userId", userIdFromState);
    }
  }, [userIdFromState, setValue]);

  const onSubmit = async (data: ChangePasswordFormValues) => {
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      await apiClient.patch("/users/password", {
        userId: data.userId,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        passwordConfirmation: data.passwordConfirmation,
      });

      localStorage.setItem("mustChangePassword", "false");
      navigate("/");
    } catch (err: any) {
      setError(err.message ?? "Password change failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        {/* EuroSupply mini header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl shadow-md mb-3">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            EuroSupply
          </span>
        </div>

        {/* Title */}
        <div className="flex items-center mb-6 gap-2 justify-center">
          <KeyRound className="w-5 h-5" />
          <h3 className="text-lg font-semibold text-gray-800">
            Change Password
          </h3>
        </div>

        <p className="text-sm text-gray-600 mb-6 text-center">
          You must change your password before accessing the application.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Current password"
              {...register("oldPassword", {
                required: "Current password is required",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {errors.oldPassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="New password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {errors.newPassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm new password"
              {...register("passwordConfirmation", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {errors.passwordConfirmation && (
              <p className="text-red-600 text-sm mt-1">
                {errors.passwordConfirmation.message}
              </p>
            )}
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-2 bg-indigo-600 text-white rounded-lg
                       hover:bg-indigo-700 transition-colors font-medium
                       disabled:opacity-60"
          >
            {isLoading ? "Changing password..." : "Change password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
