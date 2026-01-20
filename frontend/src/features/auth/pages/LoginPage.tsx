import { LogIn } from "lucide-react";
import { authService } from "../../../api/services/authService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";

type LoginFormValues = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {

    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await authService.login(data);
      localStorage.setItem("token", response.token);
      navigate("/");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <LogIn className="w-5 h-5" />
          Sign In
        </h3>
      </div>
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Username"
            {...register("username", { required: "Username is required" })}
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
            {...register("password", { required: "Password is required" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="flex-1 px-6 py-2 bg-indigo-600 text-white rounded-lg
                       hover:bg-indigo-700 transition-colors font-medium
                       disabled:opacity-60"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button className="text-indigo-600 hover:underline font-medium">
          Register
        </button>
      </div>
    </div>
  </div>
);}

export default LoginPage;