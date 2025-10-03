// hooks/useApiMutation.js
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../ApiService/apiService";


export const useApiMutation = (method = "POST") => {
    return useMutation({
        mutationFn: ({ url, data }) => apiClient({ url, method, data }),
    });
};
