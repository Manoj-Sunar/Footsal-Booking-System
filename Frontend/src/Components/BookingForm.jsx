"use client";
import { memo, useCallback, useState, useMemo, useEffect } from "react";
import InputField from "../CommonComponents/InputField";
import Button from "../CommonComponents/Button";
import FormWrapper from "../CommonComponents/FormWrapper";
import { useFormHandler } from "../CustomsHooks/useFormHandler";
import PhoneInputNepal from "../CommonComponents/PhoneInputNepal";
import { useApiMutation } from "../CustomsHooks/useApiMutation";
import ErrorMessage from "../CommonComponents/ErrorMessage";
import LoadingEffect from "../CommonComponents/LoadingEffect";
import { useWeareHouse } from "../WeareHouse/WeareHouseContext";
import { useNavigate } from "react-router-dom";
import { useBookingDetails } from "../CustomsHooks/QueryAPICalls";
import { toInputTime } from "../ModalSystem/Modals/AdminAddhoursModal";
import { Loader2 } from "lucide-react";

// === Helpers ===
const timeHelpers = {
  minStartTime: (date, todayISO) =>
    date !== todayISO ? "00:00" : new Date().toTimeString().slice(0, 5),
  minEndTime: (startTime) => {
    if (!startTime) return "00:00";
    let [h, m] = startTime.split(":").map(Number);
    h = Math.min(h + 1, 23);
    if (h === 23) m = 59;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  },
  convertTo24Hour: (time) => {
    if (!time) return "";
    if (/^\d{2}:\d{2}$/.test(time)) return time;
    const [timePart, modifier] = time.split(" ");
    let [h, m] = timePart.split(":").map(Number);
    if (modifier === "PM" && h < 12) h += 12;
    if (modifier === "AM" && h === 12) h = 0;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  },
};

const toInputDateFormat = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`; // ✅ works in <input type="date">
};

const BookingForm = ({
  slotData,
  onClose,
  timeId,
  slotId,
  bookingId,
  bookingEdit,
  isEdit = false,
}) => {
  const navigate = useNavigate();
  const { AuthUser } = useWeareHouse();
  const { isPending, mutateAsync } = useApiMutation("POST");
  const [errors, setErrors] = useState({});
  const todayISO = useMemo(() => new Date().toISOString().split("T")[0], []);

  console.log(timeId)

  // booking forms initials values
  const initialValues = useMemo(
    () => ({
      name: AuthUser?.user?.name || "",
      email: AuthUser?.user?.email || "",
      phone: AuthUser?.user?.phone || "",
      address: AuthUser?.user?.address || "",
      date: toInputDateFormat(slotData?.selectedDate) || "",
      day: slotData?.day || "",
      startTime: slotData?.slot?.startTime || "",
      endTime: slotData?.slot?.endTime || "",
      price: slotData?.slot?.price || "",
    }),
    [AuthUser, slotData]
  );

  const { formData, setFormData, handleChange, fields } = useFormHandler(
    "booking",
    initialValues
  );

  const minTimes = useMemo(
    () => ({
      startTime: timeHelpers.minStartTime(formData.date, todayISO),
      endTime: timeHelpers.minEndTime(formData.startTime),
    }),
    [formData.date, formData.startTime, todayISO]
  );

  // === Time Validation (skip if edit) ===
  const validateTime = useCallback(
    (name, value) => {
      // ⛔ Skip validation in edit mode

      if (formData.date !== todayISO) return null;
      if (name === "startTime" && value < minTimes.startTime) {
        return `Start time cannot be before ${minTimes.startTime}`;
      }
      if (
        name === "endTime" &&
        formData.startTime &&
        value < minTimes.endTime
      ) {
        return `End time must be at least 1 hour after start time (${minTimes.endTime})`;
      }
      return null;
    },
    [formData, minTimes, todayISO, isEdit]
  );

  const onChangeHandler = useCallback(
    (e) => {
      const { name, value } = e.target;
      const error =
        name === "startTime" || name === "endTime"
          ? validateTime(name, value)
          : null;
      setErrors((prev) => ({ ...prev, [name]: error }));
      if (!error) handleChange(e);
    },
    [handleChange, validateTime]
  );


  const handleBooking = useCallback(async () => {
    setErrors({});
    try {
      const response = await mutateAsync({
        url: `/booking/booked-footsal/${timeId}`,
        data: formData,
      });
      console.log(response?.booking);
      if (response?.status === false && response?.errors) {
        setErrors(response.errors);
      } else {
        onClose?.();
        navigate(
          `/payment-method/${response?.booking?._id}/${response?.booking?.day}/${slotId}/${response?.booking?.TimeSlotId}`
        );
      }
    } catch {
      setErrors({ general: "Something went wrong. Please try again." });
    }
  }, [formData, mutateAsync, onClose]);



  // === Prefill form if slotData changes
  useEffect(() => {
    if (slotData) setFormData((prev) => ({ ...prev, ...initialValues }));
  }, [slotData, setFormData, initialValues]);




  useEffect(() => {
    if (isEdit && bookingEdit) {
      setFormData({
        name: bookingEdit?.name,
        email: bookingEdit?.email,
        phone: bookingEdit?.phone,
        date: toInputDateFormat(bookingEdit?.date),
        address: bookingEdit?.address,
        startTime: toInputTime(bookingEdit?.startTime),
        endTime: toInputTime(bookingEdit?.endTime),
        price: bookingEdit?.price,
        day: bookingEdit?.day,
      });
    }
  }, [isEdit, bookingId, bookingEdit, setFormData]);


  // === Render Input Field (handles phone special case) ===
  const renderInputField = (field, index) => {
    const { type, name, label } = field;
    const commonProps = {
      key: index,
      name,
      label: label.charAt(0).toUpperCase() + label.slice(1),
      value:
        type === "time" && formData[name]
          ? timeHelpers.convertTo24Hour(formData[name])
          : formData[name] || "",
      onChange: onChangeHandler,
      error: !!errors[name],
      min:
        !isEdit && type === "date"
          ? todayISO
          : !isEdit && name === "startTime"
            ? minTimes.startTime
            : !isEdit && name === "endTime"
              ? minTimes.endTime
              : "",
      disabled: !isEdit && name === "endTime" && !formData.startTime,
    };

    if (name === "phone")
      return (
        <div key={index} className="space-y-2">
          <PhoneInputNepal
            value={formData.phone}
            onChange={handleChange}
            error={!!errors.phone}
          />
          {errors.phone && <ErrorMessage message={errors.phone} />}
        </div>
      );

    return (
      <div key={index} className="space-y-2">
        <InputField
          {...commonProps}
          type={
            type === "date"
              ? "date"
              : type === "time"
                ? "time"
                : "text"
          }
          placeholder={label.replace(/([A-Z])/g, " $1")}
        />
        {errors[name] && <ErrorMessage message={errors[name]} />}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <FormWrapper title="Footsal Booking Form">
        <div className="grid grid-cols-1 gap-4">
          {fields?.map(renderInputField)}
          {errors.general && <ErrorMessage message={errors.general} />}
          <Button
            label="✅ Book Now"
            onClick={handleBooking}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={isPending}
          />
        </div>
      </FormWrapper>
    </div>
  );
};

export default memo(BookingForm);
