import {API_URL} from "./URL";

export async function history(token) {
    return await fetch(`${API_URL}/history`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })
}

export async function favorite(token, from, to, value) {
    return await fetch(`${API_URL}/history/favorite?from=${from}&to=${to}&favorite=${value}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })
}


export async function removeHistory(token, from, to) {
    return await fetch(`${API_URL}/history/delete?from=${from}&to=${to}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })
}
