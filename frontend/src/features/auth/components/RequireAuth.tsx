import { Navigate, Outlet, useLocation } from "react-router-dom";
import type {Role} from "../types/auth.types.ts";
import {getRoleFromToken} from "../../../utils/jwt.ts";

interface RequireAuthProps {
    allowedRoles?: Role[];
}

const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
    const location = useLocation();
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace/>
    }

    const role = getRoleFromToken();
    if (allowedRoles && !allowedRoles.includes(role)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white rounded-xl shadow-xl p-8 max-w-md text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-6">
                        You don't have permission to access this page.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return <Outlet/>;
};

export default RequireAuth;
