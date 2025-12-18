import React from "react";

export interface ModalFooterProps {
    mode: "create" | "edit";
    loading: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ mode, loading, onClose, onSubmit }) => (
    <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 rounded-b-2xl flex justify-end gap-4 z-10">
        <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
        >
            Cancel
        </button>
        <button
            onClick={onSubmit}
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
            {loading ? (
                <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {mode === "create" ? "Creating..." : "Updating..."}
                </>
            ) : mode === "create" ? (
                "Create Vehicle"
            ) : (
                "Update Vehicle"
            )}
        </button>
    </div>
);