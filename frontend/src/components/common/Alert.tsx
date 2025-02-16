import { ReactNode } from "react";

type AlertProps = {
    variant?: "default" | "destructive";
    children: ReactNode;
    className?: string;
};

export const Alert = ({
    variant = "default",
    children,
    className,
}: AlertProps) => {
    const baseStyles = "rounded-lg border p-4";
    const variantStyles =
        variant === "destructive"
            ? "bg-red-50 border-red-200 text-red-800"
            : "bg-blue-50 border-blue-200 text-blue-800";

    return (
        <div
            role="alert"
            className={`${baseStyles} ${variantStyles} ${className || ""}`}
        >
            {children}
        </div>
    );
};

export const AlertDescription = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => {
    return <div className={`text-sm mt-2 ${className || ""}`}>{children}</div>;
};
