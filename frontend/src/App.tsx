import "./App.css";
import { Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <>
      <NavigationHeader />
      <Routes>
        <Route path="/" element={<p> Home Page </p>} />
        <Route
          path="/company-registration"
          element={<CompanyRegistrationPage />}
        />
        <Route path="/company-review" element={<CompanyReviewPage />} />
        <Route path="/vehicle-management" element={<VehicleManagementPage />} />
        <Route path="/product-management" element={<ProductManagementPage />} />
        <Route path="/warehouse-management" element={<WarehouseManagementPage />} />
        <Route path="/products/:productId" element={<ProductDetailsPage />} />
        <Route path="/vehicles/:vehicleId" element={<VehicleDetailsPage />} />
        <Route path="/factory-management" element={<FactoryManagementPage />} />
        <Route path="/factories/:factoryId" element={<FactoryDetailsPage />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/registration" element={<RegistrationPage/>} />
      </Routes>
    </>
  );
}

export default App;
