import {API_URL} from "./URL";

export async function login(username, password) {
    const body = JSON.stringify({username, password});
    return await fetch(`${API_URL}/login`, {
        method: "POST",
        body: body,
        headers: {
            "Content-Type": "application/json",
        }
    })
}

export async function signup(name, username, password) {
    const body = JSON.stringify({name, username, password});
    return await fetch(`${API_URL}/signup`, {
        method: "POST",
        body: body,
        headers: {
            "Content-Type": "application/json",
        }
    })
}