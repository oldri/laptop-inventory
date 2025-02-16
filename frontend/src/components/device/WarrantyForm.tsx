import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createWarranty, updateWarranty } from "../../store/device/deviceSlice";
import { WarrantyCreateDTO, WarrantyDTO } from "../../types/device";
import { FormField, FormActions } from "../common/FormField";
import type { AppDispatch } from "../../store";

interface WarrantyFormProps {
    deviceId: number;
    initialData?: WarrantyDTO;
    onClose: () => void;
}

const WarrantyForm: React.FC<WarrantyFormProps> = ({
    deviceId,
    initialData,
    onClose,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<WarrantyCreateDTO>({
        defaultValues: initialData
            ? {
                  warrantyId: initialData.warrantyId,
                  startDate: initialData.startDate,
                  endDate: initialData.endDate,
                  type: initialData.type,
                  description: initialData.description,
              }
            : undefined,
    });

    const startDate = watch("startDate");

    const onSubmit = async (data: WarrantyCreateDTO) => {
        setIsSubmitting(true);
        setError(null);

        try {
            if (initialData) {
                await dispatch(
                    updateWarranty({
                        deviceId,
                        warrantyId: initialData.id,
                        data,
                    })
                ).unwrap();
            } else {
                await dispatch(
                    createWarranty({
                        deviceId,
                        data,
                    })
                ).unwrap();
            }
            onClose();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while saving the warranty"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const warrantyTypes = [
        { value: "STANDARD", label: "Standard" },
        { value: "EXTENDED", label: "Extended" },
        { value: "PREMIUM", label: "Premium" },
        { value: "THIRD_PARTY", label: "Third Party" },
    ];

    const validateStartDate = (value: string) => {
        const date = new Date(value);
        const today = new Date();
        if (date > today) {
            return "Start date cannot be in the future";
        }
        return true;
    };

    const validateEndDate = (value: string) => {
        if (!startDate) return true;
        const start = new Date(startDate);
        const end = new Date(value);
        if (end <= start) {
            return "End date must be after start date";
        }
        return true;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            <FormField
                label="Warranty ID"
                name="warrantyId"
                register={register}
                rules={{
                    required: "Warranty ID is required",
                    maxLength: { value: 50, message: "Max 50 characters" },
                    pattern: {
                        value: /^[A-Za-z0-9-]+$/,
                        message:
                            "Warranty ID can only contain letters, numbers, and hyphens",
                    },
                }}
                error={errors.warrantyId}
            />

            <FormField
                label="Start Date"
                name="startDate"
                type="date"
                register={register}
                rules={{
                    required: "Start date is required",
                    validate: validateStartDate,
                }}
                error={errors.startDate}
            />

            <FormField
                label="End Date"
                name="endDate"
                type="date"
                register={register}
                rules={{
                    required: "End date is required",
                    validate: validateEndDate,
                }}
                error={errors.endDate}
            />

            <FormField
                label="Type"
                name="type"
                type="select"
                options={warrantyTypes}
                register={register}
                rules={{
                    required: "Warranty type is required",
                }}
                error={errors.type}
            />

            <FormField
                label="Description"
                name="description"
                type="textarea"
                register={register}
                rules={{
                    maxLength: {
                        value: 500,
                        message: "Description cannot exceed 500 characters",
                    },
                }}
                error={errors.description}
            />

            <FormActions
                onCancel={onClose}
                isSubmitting={isSubmitting}
                submitLabel={
                    initialData ? "Update Warranty" : "Create Warranty"
                }
            />
        </form>
    );
};

export default WarrantyForm;
