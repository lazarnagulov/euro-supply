import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyForm } from '../components/CompanyForm';
import type {Company} from "../types/company.types.ts";
import AppToaster from "../../../components/common/AppToaster.tsx";

export const CompanyRegistrationPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSuccess = (company: Company) => {
        console.log(`Registration request for ${company.name} submitted successfully!`);
        // TODO: Redirect to company details page
        // navigate(`/companies/${company.id}`);
        navigate('/companies');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <AppToaster />
            <div className="max-w-6xl mx-auto">
                <CompanyForm onSuccess={handleSuccess} />
            </div>
        </div>
    );
};