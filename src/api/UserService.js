import {API_URL} from "./URL";

export async function info(token) {
    return await fetch(`${API_URL}/user/info`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })
}