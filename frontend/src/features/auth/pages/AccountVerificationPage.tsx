import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { authService } from "../../../api/services/authService";

const AccountVerificationPage = () => {

    const { id } = useParams<{ id: string }>()

    useEffect(() => {
    const verifyAccount = async () => {
      if (!id) return;

      try {
        authService.verifyAccount(id);
        console.log("Account verified!");
      } catch (err: any) {
        console.error("Verification failed", err.response?.data || err.message);
      }
    };

    verifyAccount();
  }, [id]);

  return (
    <div className="relative flex min-h-[calc(100vh-70px)] items-center justify-center overflow-hidden bg-white px-6 text-center">

      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-indigo-50 blur-3xl opacity-60"></div>
      <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-purple-50 blur-3xl opacity-60"></div>

      <div className="relative z-10 max-w-2xl">
        <div className="mb-6 text-6xl">✅</div>

        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 md:text-7xl">
          Your account has been <span className="text-[#6d28d9]">successfully verified</span>
        </h1>

        <div className="mx-auto my-8 h-1.5 w-20 rounded-full bg-[#6d28d9]"></div>

        <p className="text-2xl leading-relaxed text-gray-500 font-medium">
          You can now log in and start using your account. Welcome aboard!
        </p>
      </div>
    </div>
  );
};

export default AccountVerificationPage;
