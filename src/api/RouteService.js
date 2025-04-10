import {API_URL} from "./URL";

export async function getTrains(from, to, date) {
    return await fetch(`${API_URL}/train?fromYandexCode=${from}&toYandexCode=${to}&date=${date}`, {
        method: "GET",
    })
}

export async function getPlanes(from, to, date) {
    return await fetch(`${API_URL}/plane?fromYandexCode=${from}&toYandexCode=${to}&date=${date}`, {
        method: "GET",
    })
}