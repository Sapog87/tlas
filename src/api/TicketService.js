import {API_URL} from "./URL";

export async function tickets(origin, destination, date, train) {
    const params = new URLSearchParams({
        origin,
        destination,
        date,
        train,
    });

    return await fetch(`${API_URL}/tickets?${params.toString()}`, {
        method: "GET",
    })
}