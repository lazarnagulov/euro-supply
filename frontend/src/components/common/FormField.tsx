import React from "react";

export interface FormFieldProps {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ label, required = false, error, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && "*"}
        </label>
        {children}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);