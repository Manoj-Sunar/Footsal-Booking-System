

import { createContext, useContext } from "react";
import { useApiQuery } from "../CustomsHooks/useApiQuery";


const WeareHouseContext = createContext();

export const WeareHouseProvider = ({ children }) => {

    const { data: AuthUser, isLoading, isError, error, refetch } = useApiQuery({
        queryKey: "Auth", // unique key for caching
        url: "/auth/auth-customer", // your backend endpoint
        params: {},
        // if you need params, pass here
        enabled: true, // load immediately
    });







    



    return (
        <WeareHouseContext.Provider value={{
            AuthUser,
            isLoading,
            isError,
            error,
            refetch,
           
        }}>
            {children}
        </WeareHouseContext.Provider>
    )
}


export const useWeareHouse = () => useContext(WeareHouseContext);