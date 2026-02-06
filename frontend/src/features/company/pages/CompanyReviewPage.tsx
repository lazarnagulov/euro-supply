import React, {useEffect, useState} from "react";
import {Building2, CheckCircle} from "lucide-react";
import CompanyReviewModal from "../components/CompanyReviewModal.tsx";
import CompanyCard from "../components/CompanyCard.tsx";
import type {CompanyResponse} from "../types/company.types.ts";
import {companyService} from "../../../api/services/companyService.ts";
import Pagination from "../../../components/common/Pagination.tsx";
import AppToaster from "../../../components/common/AppToaster.tsx";
import toast from "react-hot-toast";

const CompanyReviewPage: React.FC = () => {
    const [companies, setCompanies] = useState<CompanyResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState<CompanyResponse | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        loadCompanies();
    }, [currentPage]);

    const loadCompanies = async () => {
        setLoading(true);
        try {
            const data = await companyService.getPendingCompanies(currentPage, pageSize);
            setCompanies(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (error) {
            toast.error(`Failed to load companies.`);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSuccess = () => {
        loadCompanies();
        setSelectedCompany(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <AppToaster />
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Building2 className="w-8 h-8 text-indigo-600" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Pending Company Registrations</h1>
                                <p className="text-gray-600">Review and approve company registration requests</p>
                            </div>
                        </div>
                        {totalElements > 0 && (
                            <div className="text-right">
                                <p className="text-2xl font-bold text-indigo-600">{totalElements}</p>
                                <p className="text-sm text-gray-600">Pending Reviews</p>
                            </div>
                        )}
                    </div>
                </div>

                {loading && (
                    <div className="bg-white rounded-xl shadow p-12 text-center">
                        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading companies...</p>
                    </div>
                )}

                {!loading && companies.length === 0 && (
                    <div className="bg-white rounded-xl shadow p-12 text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">All Caught Up!</h3>
                        <p className="text-gray-600">There are no pending company registrations to review.</p>
                    </div>
                )}

                {!loading && companies.length > 0 && (
                    <>
                        <div className="space-y-4">
                            {companies.map(company => (
                                <CompanyCard
                                    key={company.id}
                                    company={company}
                                    onReview={() => setSelectedCompany(company)}
                                />
                            ))}
                        </div>

                        <div className="mt-6">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalElements={totalElements}
                                pageSize={pageSize}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </>
                )}

                {selectedCompany && (
                    <CompanyReviewModal
                        company={selectedCompany}
                        onClose={() => setSelectedCompany(null)}
                        onSuccess={handleReviewSuccess}
                    />
                )}
            </div>
        </div>
    );
};

export default CompanyReviewPage;