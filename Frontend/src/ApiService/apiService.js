const BASE_URL = import.meta.env.VITE_API_URL;

export const apiClient = async ({ url, method = "GET", data, params }) => {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const config = { method, headers };
    if (data) config.body = JSON.stringify(data);

    const fullUrl = `${BASE_URL}${url}${params ? `?${new URLSearchParams(params)}` : ""}`;


    let response;
    try {
        response = await fetch(fullUrl, config);

       

    } catch (err) {
        console.error("❌ Fetch failed (network/CORS):", err);
        throw { message: "Network error", details: err };
    }

    let result;
    try {
        result = await response.json();
         console.log(result);

    } catch (err) {
        console.error("❌ JSON parse failed:", err);
        throw { message: "Invalid JSON response", details: err };
    }

    if (!response.ok) {
        return result;
    }

    return result;
};
