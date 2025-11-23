import {FileText, MapPin} from "lucide-react";
import type {CompanyWithFiles} from "../types/company.types.ts";
import React, {type MouseEventHandler} from "react";

interface CompanyCardProps {
    company: CompanyWithFiles;
    onReview: MouseEventHandler<HTMLButtonElement>
};

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onReview }) => {
    const images = company.files.filter(f => f.type == "IMAGE");
    const pdfs = company.files.filter(f => f.type == "PDF");

    return (
        <div className="bg-white rounded-xl shadow hover:shadow-xl transition-shadow p-6">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-start gap-4">
                        {images[0] && (
                            <img
                                src={images[0].url}
                                alt={company.name}
                                className="w-20 h-20 rounded-lg object-cover"
                            />
                        )}

                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-800 mb-1">{company.name}</h3>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {company.address}, {company.city.name}, {company.country.name}
                                </p>
                                {/*<p>Customer: {company.customer.name} ({company.customer.email})</p>*/}
                                <p>Submitted: {new Date(company.createdAt).toLocaleDateString()}</p>
                            </div>

                            <div className="flex gap-4 mt-3">
                                <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                                  <img className="w-4 h-4" />
                                    {images.length} images
                                </span>
                                    <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                                    <FileText className="w-4 h-4" /> { pdfs.length } documents
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onReview}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                    Review
                </button>
            </div>
        </div>
    );
};

export default CompanyCard;