import './App.css'
import {Route, Routes} from "react-router-dom";
import {CompanyRegistrationPage} from "./features/company/pages/CompanyRegistrationPage.tsx";
import CompanyReviewPage from "./features/company/pages/CompanyReviewPage.tsx";
import NavigationHeader from "./components/layout/NavigationHeader.tsx";

function App() {

  return (
      <>
          <NavigationHeader />
          <Routes>
              <Route path="/" element={<p> Home Page </p>} />
              <Route path="/company-registration" element={<CompanyRegistrationPage/>}/>
              <Route path="/company-review" element={<CompanyReviewPage/>}/>
          </Routes>
      </>
  )
}

export default App
