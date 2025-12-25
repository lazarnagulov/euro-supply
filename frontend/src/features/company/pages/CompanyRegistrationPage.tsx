import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyForm } from '../components/CompanyForm';
import type {Company} from "../types/company.types.ts";

export const CompanyRegistrationPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSuccess = (company: Company) => {
        console.log('Company registered successfully:', company);
        // TODO: Redirect to company details page
        // navigate(`/companies/${company.id}`);
        navigate('/companies');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <CompanyForm onSuccess={handleSuccess} />
            </div>
        </div>
    );
};