import {API_URL} from "./URL";

export async function info(token) {
    return await fetch(`${API_URL}/user/info`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })
}

export async function getSavedRoutes(page = 0, pageSize = 10) {
    let token = localStorage.getItem("token");
    const params = new URLSearchParams({
        page,
        pageSize
    });

    return await fetch(`${API_URL}/user/route?${params.toString()}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })
}

export async function saveRoute(id) {
    let token = localStorage.getItem("token");
    const params = new URLSearchParams({
        id,
    });

    return await fetch(`${API_URL}/user/route?${params.toString()}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })
}

export async function deleteRoute(id) {
    let token = localStorage.getItem("token");
    const params = new URLSearchParams({
        id,
    });

    return await fetch(`${API_URL}/user/route?${params.toString()}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })
}