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
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default RequireAuth;
