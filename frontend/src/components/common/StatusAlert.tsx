import React from "react";
import { AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";

export type AlertType = "success" | "error" | "warning" | "info";

export interface StatusAlertProps {
    type: AlertType;
    message: string;
    onAction?: () => void;
    actionLabel?: string;
    onSecondaryAction?: () => void;
    secondaryActionLabel?: string;
}

const alertConfig = {
    success: {
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-800",
        icon: CheckCircle,
        iconColor: "text-green-600"
    },
    error: {
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-800",
        icon: AlertCircle,
        iconColor: "text-red-600"
    },
    warning: {
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-800",
        icon: AlertTriangle,
        iconColor: "text-yellow-600"
    },
    info: {
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-800",
        icon: Info,
        iconColor: "text-blue-600"
    }
};

export const StatusAlert: React.FC<StatusAlertProps> = ({
    type,
    message,
    onAction,
    actionLabel,
    onSecondaryAction,
    secondaryActionLabel
}) => {
    const config = alertConfig[type];
    const Icon = config.icon;

    return (
        <div className={`p-4 ${config.bgColor} border ${config.borderColor} rounded-lg flex flex-col gap-2`}>
            <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${config.iconColor}`} />
                <p className={config.textColor}>{message}</p>
            </div>
            {(onAction || onSecondaryAction) && (
                <div className="flex gap-2 mt-2">
                    {onAction && actionLabel && (
                        <button
                            onClick={onAction}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                type === "warning"
                                    ? "bg-yellow-600 text-white hover:bg-yellow-700"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                            }`}
                        >
                            {actionLabel}
                        </button>
                    )}
                    {onSecondaryAction && secondaryActionLabel && (
                        <button
                            onClick={onSecondaryAction}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            {secondaryActionLabel}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};