import { UserPlus } from "lucide-react"
import { useForm } from "react-hook-form";
import type { RegistrationFormValues } from "../schema/authSchema";
import { authService } from "../../../api/services/authService";


const RegistrationPage = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
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

const onSubmit = (data: RegistrationFormValues) => {
  const { username, email, password, passwordConfirmation, firstname, lastname, phoneNumber } = data;

  authService.register({
    username,
    email,
    password,
    passwordConfirmation,
    person: {
      firstname,
      lastname,
      phoneNumber,
    },
  });
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md mx-auto mt-10">
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
            type="tel"
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

export default RegistrationPage
