import {API_URL} from "./URL";

export async function getRzd(from, to, date, signal) {
    let token = localStorage.getItem("token");
    const params = new URLSearchParams({
        fromYandexCode: from,
        toYandexCode: to,
        date: date
    });

    return await fetch(`${API_URL}/rzd?${params.toString()}`, {
        method: "GET",
        signal: signal,
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })
}

export async function getYandex(from, to, date, signal) {
    let token = localStorage.getItem("token");
    const params = new URLSearchParams({
        fromYandexCode: from,
        toYandexCode: to,
        date: date
    });

    return await fetch(`${API_URL}/yandex?${params.toString()}`, {
        method: "GET",
        signal: signal,
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })
}