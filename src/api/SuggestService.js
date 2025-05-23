import {API_URL} from "./URL";

export async function getNode(code) {
    let token = localStorage.getItem("token");
    return await fetch(`${API_URL}/node?code=${code}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })
}

export async function getSuggestions(part) {
    let token = localStorage.getItem("token");

    return await fetch(`${API_URL}/suggest?part=${encodeURIComponent(part)}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })
}