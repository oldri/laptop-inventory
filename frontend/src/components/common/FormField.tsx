import React from "react";
import { UseFormRegister, FieldError } from "react-hook-form";

interface FormFieldProps {
    label: string;
    name: string;
    error?: FieldError;
    register: UseFormRegister<any>;
    rules?: Record<string, any>;
    type?: "text" | "date" | "select" | "textarea";
    options?: { value: string; label: string }[];
    className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    name,
    error,
    register,
    rules,
    type = "text",
    options = [],
    className = "",
}) => {
    const baseInputClass =
        "w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition duration-200";

    const renderField = () => {
        switch (type) {
            case "select":
                return (
                    <select
                        {...register(name, rules)}
                        className={`${baseInputClass} ${className}`}
                    >
                        {options.map(({ value, label }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                );

            case "textarea":
                return (
                    <textarea
                        {...register(name, rules)}
                        className={`${baseInputClass} min-h-[100px] ${className}`}
                    />
                );

            default:
                return (
                    <input
                        type={type}
                        {...register(name, rules)}
                        className={`${baseInputClass} ${className}`}
                    />
                );
        }
    };

    return (
        <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">
                {label}
            </label>
            {renderField()}
            {error && (
                <p className="mt-1 text-sm text-red-500">{error.message}</p>
            )}
        </div>
    );
};

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <span className="sr-only">Close</span>
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export const FormActions: React.FC<{
    onCancel: () => void;
    isSubmitting?: boolean;
    submitLabel?: string;
}> = ({ onCancel, isSubmitting = false, submitLabel = "Submit" }) => (
    <div className="flex justify-end space-x-2 mt-6">
        <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
            Cancel
        </button>
        <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
            {isSubmitting && (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {submitLabel}
        </button>
    </div>
);
