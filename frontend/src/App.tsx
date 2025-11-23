import './App.css'
import {Route, Routes} from "react-router-dom";
import {CompanyRegistrationPage} from "./features/company/pages/CompanyRegistrationPage.tsx";

function App() {

  return (
      <Routes>
          <Route path="/" element={<p> Home Page </p>} />
          <Route path="/company-registration" element={<CompanyRegistrationPage/>}/>
      </Routes>
  )
}

export default App
