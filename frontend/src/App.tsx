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
      </Routes>
    </>
  );
}

export default App
