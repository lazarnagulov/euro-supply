import React, {useEffect, useState} from "react";
import {Building2, CheckCircle, ChevronLeft, ChevronRight} from "lucide-react";
import CompanyReviewModal from "../components/CompanyReviewModal.tsx";
import CompanyCard from "../components/CompanyCard.tsx";
import type {CompanyWithFiles} from "../types/company.types.ts";

const CompanyReviewPage: React.FC = () => {
    const [companies, setCompanies] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState<CompanyWithFiles | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        setLoading(true);
        try {
            // TODO: Load companies
            setCompanies([]);
        } catch (error) {
            console.error('Failed to load companies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSuccess = () => {
        loadCompanies();
        setSelectedCompany(null);
    };

    const totalPages = Math.ceil(companies.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCompanies = companies.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <div className="flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-indigo-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Pending Company Registrations</h1>
                            <p className="text-gray-600">Review and approve company registration requests</p>
                        </div>
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
                            {paginatedCompanies.map((company: CompanyWithFiles) => (
                                <CompanyCard
                                    key={company["id"]}
                                    company={company}
                                    onReview={() => setSelectedCompany(company)}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-6 flex justify-center items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                <div className="flex gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-4 py-2 rounded-lg font-medium ${
                                                currentPage === page
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
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