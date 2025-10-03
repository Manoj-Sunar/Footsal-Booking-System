// hooks/useApiQuery.js
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../ApiService/apiService";


export const useApiQuery = ({ queryKey, url, params, enabled = true}) => {

  return useQuery({
    queryKey: [queryKey, params],
    queryFn: () => apiClient({ url, params }),
    enabled,
    keepPreviousData: true, // ✅ no flicker on filter/page change
    staleTime: 1000 * 30,
   
  });
  
};
