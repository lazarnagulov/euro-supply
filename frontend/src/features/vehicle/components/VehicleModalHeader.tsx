import React from "react";
import { X } from "lucide-react";

export interface ModalHeaderProps {
    mode: "create" | "edit";
    onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ mode, onClose }) => (
    <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl z-10">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold">
                    {mode === "create" ? "Add New Vehicle" : "Edit Vehicle"}
                </h2>
                <p className="text-indigo-100">
                    {mode === "create" ? "Register a new delivery vehicle" : "Update vehicle information"}
                </p>
            </div>
            <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close modal"
            >
                <X className="w-6 h-6" />
            </button>
        </div>
    </div>
);