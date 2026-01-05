import { LogIn } from "lucide-react";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <LogIn className="w-5 h-5" />
            Sign In
          </h3>
        </div>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Username or email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 px-6 py-2 bg-indigo-600 text-white rounded-lg
                         hover:bg-indigo-700 transition-colors font-medium"
            >
              Login
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <button className="text-indigo-600 hover:underline font-medium">
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
