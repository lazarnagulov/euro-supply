import "./App.css";
import {Navigate, Route, Routes} from "react-router-dom";
import { CompanyRegistrationPage } from "./features/company/pages/CompanyRegistrationPage.tsx";
import CompanyReviewPage from "./features/company/pages/CompanyReviewPage.tsx";
import NavigationHeader from "./components/layout/NavigationHeader.tsx";
import VehicleManagementPage from "./features/vehicle/pages/VehicleManagementPage.tsx";
import ProductManagementPage from "./features/product/pages/ProductManagementPage.tsx";
import ProductDetailsPage from "./features/product/pages/ProductDetailsPage.tsx";
import VehicleDetailsPage from "./features/vehicle/pages/VehicleDetailsPage.tsx";
import WarehouseManagementPage from "./features/warehouse/pages/WarehouseManagementPage.tsx";
import FactoryDetailsPage from "./features/factory/pages/FactoryDetailsPage.tsx";
import FactoryManagementPage from "./features/factory/pages/FactoryManagementPage.tsx";
import LoginPage from "./features/auth/pages/LoginPage.tsx";
import RegistrationPage from "./features/auth/pages/RegistrationPage.tsx";
import WelcomePage from "./features/home/pages/WelcomePage.tsx";
import AccountVerificationPage from "./features/auth/pages/AccountVerificationPage.tsx";
import ProductCatalogPage from "./features/product/pages/ProductCatalogPage.tsx";
import ManagerManagementPage from "./features/manager/pages/ManagerManagementPage.tsx";
import ChangePasswordPage from "./features/auth/pages/ChangePasswordPage.tsx";
import {ROLES} from "./features/auth/types/auth.types.ts";
import RequireAuth from "./features/auth/components/RequireAuth.tsx";
import WarehouseDetailsPage from "./features/warehouse/pages/WarehouseDetailsPage.tsx";

function App() {
  return (
    <>
      <NavigationHeader />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/account-verification/:id" element={<AccountVerificationPage />}/>
        <Route element={<RequireAuth allowedRoles={[ROLES.CUSTOMER]} />}>
            <Route path="/company-registration" element={<CompanyRegistrationPage />}/>
            <Route path="/products-catalog" element={<ProductCatalogPage />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]} />}>
            <Route path="/company-review" element={<CompanyReviewPage />} />
            <Route path="/vehicle-management" element={<VehicleManagementPage />} />
            <Route path="/product-management" element={<ProductManagementPage />} />
            <Route path="/warehouse-management" element={<WarehouseManagementPage />}/>
            <Route path="/factory-management" element={<FactoryManagementPage />} />
            <Route path="/products/:productId" element={<ProductDetailsPage />} />
            <Route path="/vehicles/:vehicleId" element={<VehicleDetailsPage />} />
            <Route path="/factories/:factoryId" element={<FactoryDetailsPage />} />
            <Route path="/warehouses/:warehouseId" element={<WarehouseDetailsPage />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/manager-management" element={<ManagerManagementPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
