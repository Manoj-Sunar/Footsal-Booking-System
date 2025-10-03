"use client";
import { useState, useMemo, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { useQueryClient } from "@tanstack/react-query";
import { SquarePen, Trash2 } from "lucide-react";

import { useAllCustomers } from "../../CustomsHooks/QueryAPICalls";
import FilteringComponent from "../../CommonComponents/FilteringComponent";
import SmartTable from "../admin-component/SmartTable";
import Pagination from "../../CommonComponents/Pagination";
import LoadingEffect from "../../CommonComponents/LoadingEffect";
import { useApiMutation } from "../../CustomsHooks/useApiMutation";

// ✅ keep configs outside component (avoids re-creation)
const FILTERS_CONFIG = [
  { name: "name", label: "User Name", type: "text" },
  { name: "date", label: "Booking Date", type: "date" },
  { name: "phone", label: "Phone", type: "number" },
];

const COLUMNS = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "phone", header: "Phone" },
  { key: "address", header: "Address" },
  {
    key: "createdAt",
    header: "Joined",
    render: (v) => new Date(v).toLocaleDateString(),
  },
];

const PAGE_LIMIT = 10;

const AdminAllCustomers = () => {


  const [filters, setFilters] = useState({ name: "", date: "", phone: "" });

  const [debouncedFilters] = useDebounce(filters, 500);
  
  const [page, setPage] = useState(1);

  // ✅ stable query params
  const queryParams = useMemo(
    () => ({ filters: debouncedFilters, page, limit: PAGE_LIMIT }),
    [debouncedFilters, page]
  );

  const { data, isLoading, isFetching, isError, error } =
    useAllCustomers(queryParams);

  const queryClient = useQueryClient();

  const { mutateAsync: deleteCustomer, isPending: isDeleting } =
    useApiMutation("DELETE");

  const handleDelete = useCallback(
    async (id) => {
      try {
        const response = await deleteCustomer({
          url: `/auth/customer-delete/${id}`,
        });

        if (response?.status) {
          queryClient.invalidateQueries({ queryKey: ["allCustomers"] });
          alert("Customer deleted successfully ✅");
        }
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete customer ❌");
      }
    },
    [deleteCustomer, queryClient]
  );


  const renderActions = useCallback(
    (row) => (
      <div className="flex items-center gap-2">
        <SquarePen className="text-green-500 cursor-pointer" />
        <Trash2
          className="text-red-500 cursor-pointer"
          onClick={() => handleDelete(row?._id)}
        />
      </div>
    ),
    [handleDelete]
  );


  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col gap-y-8">
      {/* ✅ Filters always mounted */}
      <FilteringComponent
        filtersConfig={FILTERS_CONFIG}
        filterBy={filters}
        setValue={setFilters}
      />

      {/* ✅ Loading and error states */}
      {isLoading ? (
        <LoadingEffect message="Loading customers..." />
      ) : isError ? (
        <div className="text-red-500">
          Failed to load customers: {error?.message}
        </div>
      ) : (
        <>
          <SmartTable
            columns={COLUMNS}
            data={data?.data}
            showActions
            extraActions={renderActions}
            loading={isFetching || isDeleting}
          />

          <Pagination
            totalPages={data?.totalPages || 1}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default AdminAllCustomers;
