import React, {useEffect, useState} from "react";
import {Building2, CheckCircle, ChevronLeft, ChevronRight} from "lucide-react";
import CompanyReviewModal from "../components/CompanyReviewModal.tsx";
import CompanyCard from "../components/CompanyCard.tsx";
import type {CompanyResponse} from "../types/company.types.ts";
import {companyService} from "../../../api/services/companyService.ts";

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
            console.log(data);
            setCompanies(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
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

    const startIndex = currentPage * pageSize + 1;
    const endIndex = Math.min((currentPage + 1) * pageSize, totalElements);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
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

                        {totalPages > 1 && (
                            <div className="mt-6 bg-white rounded-xl shadow p-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-600">
                                        Showing {startIndex} to {endIndex} of {totalElements} companies
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                            disabled={currentPage === 0}
                                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>

                                        <div className="flex gap-2">
                                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i;
                                                } else if (currentPage < 3) {
                                                    pageNum = i;
                                                } else if (currentPage > totalPages - 4) {
                                                    pageNum = totalPages - 5 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setCurrentPage(pageNum)}
                                                        className={`px-4 py-2 rounded-lg font-medium ${
                                                            currentPage === pageNum
                                                                ? 'bg-indigo-600 text-white'
                                                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                        }`}
                                                    >
                                                        {pageNum + 1}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                                            disabled={currentPage === totalPages - 1}
                                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
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