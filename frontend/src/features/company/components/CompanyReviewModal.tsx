import React, {useState} from "react";
import {AlertCircle, Building2, CheckCircle, FileText, X, XCircle} from "lucide-react";
import {type CompanyWithFiles, RequestStatus} from "../types/company.types.ts";

interface CompanyReviewModelProps {
    company: CompanyWithFiles;
    onClose: any;
    onSuccess: any;
}

const CompanyReviewModal: React.FC<CompanyReviewModelProps> = ({ company, onClose, onSuccess }) => {
    const [selectedStatus, setSelectedStatus] = useState<RequestStatus | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);

    const images = company.files.filter(f => f.type == "IMAGE");
    const documents = company.files.filter(f => f.type == "PDF");

    const handleSubmit = async () => {
        setError('');

        if (!selectedStatus) {
            setError('Please select a decision (Approve or Reject)');
            return;
        }

        if (selectedStatus === 'REJECTED' && !rejectionReason.trim()) {
            setError('Rejection reason is required when rejecting a company');
            return;
        }

        setLoading(true);
        try {
            // TODO: Send request
            onSuccess();
        } catch (err) {
            setError('Failed to submit review. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">Review Company Registration</h2>
                            <p className="text-indigo-100">{company.name}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-indigo-600" />
                            Company Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                            <div>
                                <p className="text-sm text-gray-600">Company Name</p>
                                <p className="font-semibold text-gray-800">{company.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Address</p>
                                <p className="font-semibold text-gray-800">{company.address}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">City</p>
                                <p className="font-semibold text-gray-800">{company.city.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Country</p>
                                <p className="font-semibold text-gray-800">{company.country.name}</p>
                            </div>
                            {/*<div>*/}
                            {/*    <p className="text-sm text-gray-600">Customer</p>*/}
                            {/*    <p className="font-semibold text-gray-800">{company.customer.name}</p>*/}
                            {/*</div>*/}
                            {/*<div>*/}
                            {/*    <p className="text-sm text-gray-600">Email</p>*/}
                            {/*    <p className="font-semibold text-gray-800">{company.customer.email}</p>*/}
                            {/*</div>*/}
                            <div className="col-span-2">
                                <p className="text-sm text-gray-600">Location</p>
                                <p className="font-semibold text-gray-800">
                                    {company.latitude.toFixed(6)}, {company.longitude.toFixed(6)}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Company Images */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <img className="w-5 h-5 text-indigo-600" />
                            Company Images ({images.length})
                        </h3>

                        <div className="mb-4">
                            <img
                                src={images[selectedImage]?.url}
                                alt={`Company ${selectedImage + 1}`}
                                className="w-full h-96 object-cover rounded-xl border-2 border-gray-200"
                            />
                        </div>

                        {/* Image Thumbnails */}
                        <div className="grid grid-cols-4 gap-3">
                            {images.map((image, index) => (
                                <button
                                    key={image.id}
                                    onClick={() => setSelectedImage(index)}
                                    className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                                        selectedImage === index
                                            ? 'border-indigo-600 ring-2 ring-indigo-200'
                                            : 'border-gray-200 hover:border-indigo-300'
                                    }`}
                                >
                                    <img
                                        src={image.url}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-24 object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-600" />
                            Ownership Documents ({documents.length})
                        </h3>
                        <div className="space-y-2">
                            {documents.map(doc => (
                                <div
                                    key={doc.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-100 rounded-lg">
                                            <FileText className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{doc.filename}</p>
                                            <p className="text-sm text-gray-600">PDF Document</p>
                                        </div>
                                    </div>
                                    <a
                                        href="#"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                    >
                                        View
                                    </a>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Decision</h3>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <button
                                onClick={() => setSelectedStatus(RequestStatus.APPROVED)}
                                className={`p-6 rounded-xl border-2 transition-all ${
                                    selectedStatus === 'APPROVED'
                                        ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                                        : 'border-gray-300 hover:border-green-300 hover:bg-green-50/50'
                                }`}
                            >
                                <CheckCircle className={`w-10 h-10 mx-auto mb-3 ${
                                    selectedStatus === 'APPROVED' ? 'text-green-600' : 'text-gray-400'
                                }`} />
                                <p className="font-semibold text-center text-lg">Approve</p>
                                <p className="text-sm text-gray-600 text-center mt-1">
                                    Company registration will be approved
                                </p>
                            </button>

                            <button
                                onClick={() => setSelectedStatus(RequestStatus.REJECTED)}
                                className={`p-6 rounded-xl border-2 transition-all ${
                                    selectedStatus === 'REJECTED'
                                        ? 'border-red-500 bg-red-50 ring-2 ring-red-200'
                                        : 'border-gray-300 hover:border-red-300 hover:bg-red-50/50'
                                }`}
                            >
                                <XCircle className={`w-10 h-10 mx-auto mb-3 ${
                                    selectedStatus === 'REJECTED' ? 'text-red-600' : 'text-gray-400'
                                }`} />
                                <p className="font-semibold text-center text-lg">Reject</p>
                                <p className="text-sm text-gray-600 text-center mt-1">
                                    Company registration will be rejected
                                </p>
                            </button>
                        </div>

                        {selectedStatus === 'REJECTED' && (
                            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    Rejection Reason *
                                </label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    rows={4}
                                    placeholder="Please provide a detailed reason for rejection. This will be sent to the customer via email."
                                    className="w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                />
                                <p className="text-xs text-gray-600 mt-2">
                                    Be specific and constructive. Help the customer understand what needs to be corrected.
                                </p>
                            </div>
                        )}
                    </section>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            <p className="text-red-800">{error}</p>
                        </div>
                    )}
                </div>

                <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 rounded-b-2xl flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedStatus || loading}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Decision'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompanyReviewModal;