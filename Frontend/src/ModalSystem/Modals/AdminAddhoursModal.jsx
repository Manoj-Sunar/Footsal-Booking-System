import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "../../CommonComponents/Button";
import { useFormHandler } from "../../CustomsHooks/useFormHandler";
import { PackageForm } from "../../CommonComponents/Form";
import { useApiMutation } from "../../CustomsHooks/useApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import LoadingEffect from "../../CommonComponents/LoadingEffect";

// Convert "9:05 AM" / "09:05:00" / "09:05" -> "09:05"
export const toInputTime = (val) => {
    if (!val) return "";
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(val)) return val.slice(0, 5);
    const m = String(val).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (m) {
        let h = parseInt(m[1], 10) % 12;
        if (/PM/i.test(m[3])) h += 12;
        return `${String(h).padStart(2, "0")}:${m[2]}`;
    }
    return val;
};

const AdminAddHoursModalContent = ({
    closeModal,
    currentYear,
    currentMonth,
    selectedDay,
    fullDate,
    isEdit,
    startTime,
    endTime,
    price,

}) => {

    const [currentFormKey] = useState("addTimeSlots");
    const queryClient = useQueryClient();


    console.log(startTime,endTime,);

    // ✅ formData now respects initialValues
    const { formData, handleChange, setFormData } = useFormHandler(currentFormKey);

    const { isPending, mutateAsync } = useApiMutation('POST');



    const handleCreateTimeSlot = useCallback(async () => {
        try {
            const response = await mutateAsync({
                url: '/hourly/admin-create-time-slot',
                data: { year: currentYear, month: currentMonth, day: selectedDay, startTime: formData.startTime, endTime: formData.endTime, price: formData.price, fullDate: fullDate }
            });

            console.log(response);
            if (response.status === true) {
                closeModal();
                queryClient.invalidateQueries(['timeSlots']);
            }

        } catch (error) {
            throw new Error(error);
        }

    }, [queryClient, formData, mutateAsync])



    useEffect(() => {
        if (isEdit === true) {
            setFormData({
                startTime:toInputTime(startTime),
                endTime:toInputTime(endTime),
                price: price,
            })
        }

    }, [isEdit, startTime, endTime, price])



    if (isPending) return <LoadingEffect />





    return (
        <div>


            <PackageForm
                formKey={currentFormKey}
                formData={formData}
                handleChange={handleChange}
                error={{}}
            />

            <div className="mt-4 flex gap-x-2 justify-end">
                <Button
                    label="Close"
                    className="px-5 py-2 rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-300"
                    onClick={closeModal}
                />
                <Button
                    label={`${isEdit?'Updated Slots':'Add Hours'}`}
                    className="px-5 py-2 cursor-pointer bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-60"
                    onClick={handleCreateTimeSlot}

                />
            </div>
        </div>
    );
};

export default AdminAddHoursModalContent;
