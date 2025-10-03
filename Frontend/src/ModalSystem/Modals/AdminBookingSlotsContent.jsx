import { useState } from "react";
import Button from "../../CommonComponents/Button";
import { useFormHandler } from "../../CustomsHooks/useFormHandler";
import { PackageForm } from "../../CommonComponents/Form";
import { useApiMutation } from "../../CustomsHooks/useApiMutation";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import LoadingEffect from "../../CommonComponents/LoadingEffect";
import { useQueryClient } from "@tanstack/react-query";

const AdminBookingSlotsModalContent = ({ closeModal }) => {

    const { packageId } = useParams();

    const [currentFormKey] = useState("bookingSlots");
    // ✅ default key
    const { formData, handleChange } = useFormHandler(currentFormKey);

    const queryClient = useQueryClient();

    const [errors, setErrors] = useState({});

    const { isPending, mutateAsync } = useApiMutation("POST");



    const handleAddTimeSlots = useCallback(async () => {

        try {
            const response = await mutateAsync({
                url: `/hourly/hourly-time-slots/${packageId}`,
                data: formData,
            });

            console.log(response);

            if (response.status === true || response.success) {
                closeModal();
                queryClient.invalidateQueries(['timeSlots']);
            }
        } catch (err) {

            setErrors(err.errors || {});
        }
    }, [mutateAsync, formData, closeModal, queryClient]);





    return (
        <div className="relative">
            {isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                    <LoadingEffect />
                </div>
            )}

            <h2 className="text-xl font-bold text-center text-blue-700 mb-4">
                Add / Block Booking Slots
            </h2>

            <PackageForm
                formKey={currentFormKey}
                formData={formData}
                handleChange={handleChange}
                error={errors}
            />

            <div className="mt-4 flex gap-x-2 justify-end">
                <Button
                    label="Close"
                    className="px-5 py-2 rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-300"
                    onClick={closeModal}
                />
                <Button
                    label="Add Days"
                    className="px-5 py-2 cursor-pointer bg-green-500 text-white rounded-lg hover:bg-green-600"
                    onClick={handleAddTimeSlots}
                />
            </div>
        </div>
    );
};

export default AdminBookingSlotsModalContent;
