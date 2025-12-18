import React from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

export type SubmitStatus = "success" | "error" | "partial-success" | null;

export interface StatusAlertProps {
    status: SubmitStatus;
    mode: "create" | "edit";
    error: string | null;
    onRetry: () => void;
    onContinue: () => void;
    loading: boolean;
}

export const StatusAlert: React.FC<StatusAlertProps> = ({
    status,
    mode,
    error,
    onRetry,
    onContinue,
    loading
}) => {
    if (!status) return null;

    if (status === "success") {
        return (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800">
                    Vehicle {mode === "create" ? "created" : "updated"} successfully!
                </p>
            </div>
        );
    }

    if (status === "partial-success") {
        return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <p className="text-yellow-800">Vehicle created but image upload failed.</p>
                </div>
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={onRetry}
                        disabled={loading}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                    >
                        Retry Upload
                    </button>
                    <button
                        onClick={onContinue}
                        disabled={loading}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Continue
                    </button>
                </div>
                {error && <p className="text-yellow-700 text-sm">{error}</p>}
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">
                    Failed to {mode === "create" ? "create" : "update"} vehicle.
                    {error ? ` ${error}` : " Please try again."}
                </p>
            </div>
        );
    }

    return null;
};