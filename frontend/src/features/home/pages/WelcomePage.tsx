import { getUsernameFromToken } from "../../../utils/jwt";

const WelcomePage = () => {
  const username = getUsernameFromToken();
  const isLoggedIn = username !== null;

  return (
    <div className="relative flex min-h-[calc(100vh-70px)] items-center justify-center overflow-hidden bg-white px-6 text-center">
      
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-indigo-50 blur-3xl opacity-60"></div>
      <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-purple-50 blur-3xl opacity-60"></div>

      <div className="relative z-10 max-w-2xl">
        <div className="mb-6 text-6xl">🏢</div>

        {isLoggedIn ? (
          <>
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 md:text-7xl">
              Welcome back, <span className="text-[#6d28d9]">{username}</span>
            </h1>
            <div className="mx-auto my-8 h-1.5 w-20 rounded-full bg-[#6d28d9]"></div>
            <p className="text-2xl leading-relaxed text-gray-500 font-medium">
              Your dashboard is ready. Access your management tools using the navigation menu above.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 md:text-7xl">
              Welcome to <span className="text-[#6d28d9]">EuroSupply</span>
            </h1>
            <div className="mx-auto my-8 h-1.5 w-20 rounded-full bg-[#6d28d9]"></div>
            <p className="text-2xl leading-relaxed text-gray-500 font-medium">
              Professional Logistics and Supply Chain Management System.
            </p>
            <p className="mt-4 text-gray-400">
              Please log in or create an account to start managing your resources.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default WelcomePage;