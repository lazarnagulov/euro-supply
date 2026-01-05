import { UserPlus } from "lucide-react";

const RegistrationForm = () => {
  return (
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md mx-auto">
      <div className="center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Create Account
        </h3>
      </div>

      <form className="space-y-4">
        <input
          type="text"
          placeholder="First name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />

        <input
          type="text"
          placeholder="Last name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />

        <input
          type="email"
          placeholder="Email address"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />

        <input
          type="tel"
          placeholder="Phone number"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />

        <input
          type="text"
          placeholder="Username"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />

        <input
          type="password"
          placeholder="Confirm password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 px-6 py-2 bg-indigo-600 text-white rounded-lg
                       hover:bg-indigo-700 transition-colors font-medium"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;