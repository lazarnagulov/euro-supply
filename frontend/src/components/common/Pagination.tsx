import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalElements,
    pageSize,
    onPageChange,
    maxVisiblePages = 5,
}) => {
    if (totalPages <= 1) return null;

    const startIndex = currentPage * pageSize + 1;
    const endIndex = Math.min((currentPage + 1) * pageSize, totalElements);

    const getPageNumbers = () => {
        const pages: number[] = [];
        const maxPages = Math.min(totalPages, maxVisiblePages);

        for (let i = 0; i < maxPages; i++) {
            let pageNum;
            if (totalPages <= maxVisiblePages) {
                pageNum = i;
            } else if (currentPage < Math.floor(maxVisiblePages / 2)) {
                pageNum = i;
            } else if (currentPage > totalPages - Math.ceil(maxVisiblePages / 2)) {
                pageNum = totalPages - maxVisiblePages + i;
            } else {
                pageNum = currentPage - Math.floor(maxVisiblePages / 2) + i;
            }
            pages.push(pageNum);
        }

        return pages;
    };

    return (
        <div className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                    Showing {startIndex} to {endIndex} of {totalElements} items
                </p>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex gap-2">
                        {getPageNumbers().map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    currentPage === pageNum
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                }`}
                                aria-label={`Page ${pageNum + 1}`}
                                aria-current={currentPage === pageNum ? 'page' : undefined}
                            >
                                {pageNum + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
                        disabled={currentPage === totalPages - 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next page"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;