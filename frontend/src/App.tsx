import "./App.css";
import { Route, Routes } from "react-router-dom";
import { CompanyRegistrationPage } from "./features/company/pages/CompanyRegistrationPage.tsx";
import CompanyReviewPage from "./features/company/pages/CompanyReviewPage.tsx";
import NavigationHeader from "./components/layout/NavigationHeader.tsx";
import VehicleManagementPage from "./features/vehicle/pages/VehicleManagementPage.tsx";
import ProductManagementPage from "./features/product/pages/ProductManagementPage.tsx";

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
      </Routes>
    </>
  );
}

export default App;
