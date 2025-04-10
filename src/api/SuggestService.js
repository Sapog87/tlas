import {API_URL} from "./URL";

export async function getNode(code) {
    return await fetch(`${API_URL}/node?code=${code}`, {
        method: "GET",
    })
}

export async function getSuggestions(part) {
    return await fetch(`${API_URL}/suggest?part=${part}`, {
        method: "GET",
    })
}