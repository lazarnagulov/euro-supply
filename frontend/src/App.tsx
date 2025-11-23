import "./App.css";
import { Route, Routes } from "react-router-dom";
import { CompanyRegistrationPage } from "./features/company/pages/CompanyRegistrationPage.tsx";
import { CategoryCreationPage } from "./features/product/pages/CategoryCreationForm.tsx";
import { CategoryListPage } from "./features/product/pages/CategoryListPage.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<p> Home Page </p>} />
      <Route
        path="/company-registration"
        element={<CompanyRegistrationPage />}
      />
      <Route path="/category-creation" element={<CategoryCreationPage />} />
      <Route path="/categories" element={<CategoryListPage />} />
    </Routes>
  );
}

export default App;
