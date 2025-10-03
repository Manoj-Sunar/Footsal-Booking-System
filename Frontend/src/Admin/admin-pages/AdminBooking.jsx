"use client";
import { useState, useMemo, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { useQueryClient } from "@tanstack/react-query";
import { SquarePen, Trash2 } from "lucide-react";

import FilteringComponent from "../../CommonComponents/FilteringComponent";
import SmartTable from "../admin-component/SmartTable";
import Pagination from "../../CommonComponents/Pagination";
import DropdownMenu from "../../CommonComponents/DropdownMenu";
import { useApiMutation } from "../../CustomsHooks/useApiMutation";
import { useModal } from "../../ModalSystem/ModalContext";
import { useBookingDetails } from "../../CustomsHooks/QueryAPICalls";

// ✅ Move configs outside to avoid recreation
const FILTERS_CONFIG = [
  { name: "name", label: "User Name", type: "text" },
  { name: "date", label: "Booking Date", type: "date" },
  { name: "phone", label: "Phone", type: "number" },
];

const BOOKING_STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"];

const AdminBooking = () => {
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({ name: "", date: "", phone: "" });
  const [debouncedFilters] = useDebounce(filters, 500);
  const [page, setPage] = useState(1);

  // ✅ Stable query params
  const queryParams = useMemo(
    () => ({ filters: debouncedFilters, page }),
    [debouncedFilters, page]
  );

  const {
    data,
    isFetching,
    isError,
    error,
    isLoading,
  } = useBookingDetails(['booking', queryParams]);



  // ✅ Mutations with status
  const { mutateAsync: deleteBooking, isPending: isDeleting } =
    useApiMutation("DELETE");
  const { mutateAsync: updateStatus, isPending: isUpdating } =
    useApiMutation("PUT");



  const handleStatusChange = useCallback(
    async (id, status) => {
      try {
        const res = await updateStatus({
          url: `/booking/admin/booked-footsal-changed/${id}`,
          data: { status },
        });
        if (res?.status) {
          queryClient.invalidateQueries( ["booking"] );
          
        }
      } catch (err) {
        console.error("Failed to update booking:", err);
        alert("Failed to update booking ❌");
      }
    },
    [updateStatus, queryClient]
  );




  const handleDelete = useCallback(
    async (id) => {
      try {
        const res = await deleteBooking({
          url: `/booking/admin-booking-delete/${id}`,
        });
        if (res?.status) {
          queryClient.invalidateQueries({ queryKey: ["booking"] });
          alert("Booking deleted ✅");
        }
      } catch (err) {
        console.error("Failed to delete booking:", err);
        alert("Failed to delete booking ❌");
      }
    },
    [deleteBooking, queryClient]
  );



  const columns = useMemo(
    () => [
      {
        key: "user",
        header: "User",
        render: (_, row) => row.user?.name || row.name,
      },
      {
        key: "contact",
        header: "Contact",
        render: (_, row) => (
          <>
            {row.phone}
            <br />
            <span className="text-xs">{row.email}</span>
          </>
        ),
      },
      {
        key: "date",
        header: "Date",
        render: (_, row) => new Date(row.date).toLocaleDateString(),
      },
      { key: "day", header: "Day" },
      {
        key: "time",
        header: "Time",
        render: (_, row) => `${row.startTime} - ${row.endTime}`,
      },
      {
        key: "price",
        header: "Price",
        render: (v) => `₹${v}`,
      },
      { key: "bookingStatus", header: "Status" },
      {
        key: "updateBookingStatus",
        header: "Change Status",
        render: (_, row) => (
          <DropdownMenu
            trigger={
              <button className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
                Change
              </button>
            }
            items={BOOKING_STATUSES.map((status) => ({
              label: status,
              onClick: () => handleStatusChange(row._id, status),
            }))}
          />
        ),
      },
    ],
    [handleStatusChange]
  );




  const extraActions = useCallback(
    (row) => (
      <div className="flex items-center gap-2">
        <SquarePen
          className="text-green-500 cursor-pointer"
          onClick={() => openModal("adminBookingEdit", { bookingRow: row })}
        />
        <Trash2
          className="text-red-500 cursor-pointer"
          onClick={() => handleDelete(row._id)}
        />
      </div>
    ),
    [handleDelete, openModal]
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col gap-y-8">
      {/* Filters */}
      <FilteringComponent
        filtersConfig={FILTERS_CONFIG}
        filterBy={filters}
        setValue={setFilters}
      />

      {/* Error / Loading states */}

      {isError && (
        <div className="text-red-500">
          Failed to fetch bookings: {error?.message}
        </div>
      )}

      {/* Table */}
      {data && (
        <SmartTable
          columns={columns}
          data={data?.data}
          showActions
          extraActions={extraActions}
          loading={isFetching || isDeleting || isUpdating}
        />
      )}

      {/* Pagination */}
      <Pagination
        totalPages={data?.totalPages || 1}
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
};

export default AdminBooking;
