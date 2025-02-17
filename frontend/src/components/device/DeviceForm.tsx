import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
    createDevice,
    updateDeviceThunk,
} from "../../store/deviceSlice";
import { DeviceCreateDTO, DeviceDTO } from "../../types/device";
import { FormField, FormActions } from "../common/FormField";
import type { AppDispatch } from "../../store";

interface DeviceFormProps {
    initialData?: DeviceDTO | null;
    onClose: () => void;
}

const DeviceForm: React.FC<DeviceFormProps> = ({ initialData, onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<DeviceCreateDTO>({
        defaultValues: initialData
            ? {
                  serialNumber: initialData.serialNumber,
                  manufacturer: initialData.manufacturer,
                  modelName: initialData.modelName,
                  purchaseDate: initialData.purchaseDate,
                  condition: initialData.condition,
                  location: initialData.location,
              }
            : undefined,
    });

    const onSubmit = async (data: DeviceCreateDTO) => {
        setIsSubmitting(true);
        setError(null);

        try {
            if (initialData) {
                await dispatch(
                    updateDeviceThunk({ id: initialData.id, data })
                ).unwrap();
            } else {
                await dispatch(createDevice(data)).unwrap();
            }
            onClose();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while saving the device"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const locationOptions = [
        { value: "WAREHOUSE", label: "Warehouse" },
        { value: "OFFICE_HQ", label: "Office HQ" },
        { value: "OFFICE_BRANCH", label: "Office Branch" },
        { value: "WITH_EMPLOYEE", label: "With Employee" },
        { value: "IN_TRANSIT", label: "In Transit" },
    ];

    const conditionOptions = [
        { value: "NEW", label: "New" },
        { value: "USED", label: "Used" },
        { value: "REFURBISHED", label: "Refurbished" },
        { value: "DAMAGED", label: "Damaged" },
    ];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            <FormField
                label="Serial Number"
                name="serialNumber"
                register={register}
                rules={{
                    required: "Serial number is required",
                    maxLength: { value: 50, message: "Max 50 characters" },
                    pattern: {
                        value: /^[A-Za-z0-9-]+$/,
                        message:
                            "Serial number can only contain letters, numbers, and hyphens",
                    },
                }}
                error={errors.serialNumber}
            />

            <FormField
                label="Manufacturer"
                name="manufacturer"
                register={register}
                rules={{
                    required: "Manufacturer is required",
                    maxLength: { value: 100, message: "Max 100 characters" },
                }}
                error={errors.manufacturer}
            />

            <FormField
                label="Model Name"
                name="modelName"
                register={register}
                rules={{
                    required: "Model name is required",
                    maxLength: { value: 100, message: "Max 100 characters" },
                }}
                error={errors.modelName}
            />

            <FormField
                label="Purchase Date"
                name="purchaseDate"
                type="date"
                register={register}
                rules={{
                    required: "Purchase date is required",
                    validate: {
                        notFuture: (value: any) =>
                            new Date(value) <= new Date() ||
                            "Purchase date cannot be in the future",
                    },
                }}
                error={errors.purchaseDate}
            />

            <FormField
                label="Condition"
                name="condition"
                type="select"
                options={conditionOptions}
                register={register}
                rules={{ required: "Condition is required" }}
                error={errors.condition}
            />

            <FormField
                label="Location"
                name="location"
                type="select"
                options={locationOptions}
                register={register}
                rules={{ required: "Location is required" }}
                error={errors.location}
            />

            <FormActions
                onCancel={onClose}
                isSubmitting={isSubmitting}
                submitLabel={initialData ? "Update Device" : "Create Device"}
            />
        </form>
    );
};

export default DeviceForm;
