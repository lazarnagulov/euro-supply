import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    itemName?: string;
    confirmText?: string;
    loading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Deletion",
    message = "Are you sure you want to delete this item? This action cannot be undone.",
    itemName,
    confirmText = "DELETE",
    loading = false,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (inputValue !== confirmText) {
            setError(`Please type "${confirmText}" to confirm`);
            return;
        }
        setError('');
        onConfirm();
    };

    const handleClose = () => {
        if (!loading) {
            setInputValue('');
            setError('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-2xl">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{title}</h2>
                                {itemName && (
                                    <p className="text-red-100 mt-1">{itemName}</p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={loading}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                        <p className="text-gray-800 leading-relaxed">
                            {message}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Type <span className="font-mono text-red-600">{confirmText}</span> to confirm
                        </label>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                setError('');
                            }}
                            placeholder={confirmText}
                            disabled={loading}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        {error && (
                            <p className="text-red-600 text-sm mt-2">{error}</p>
                        )}
                    </div>
                </div>

                <div className="bg-gray-50 p-6 border-t border-gray-200 rounded-b-2xl flex justify-end gap-4">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={inputValue !== confirmText || loading}
                        className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Delete Permanently'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;