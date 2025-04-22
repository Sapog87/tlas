const options = {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: 'numeric',
};

export const formatDate = (isoDate) => {
    const date = new Date(isoDate);

    return new Intl.DateTimeFormat('ru-RU', {
        ...options,
        timeZone: 'Europe/Moscow'
    }).format(date).replace(',', '');
};

export const formatDateWithoutOffset = (isoDate) => {
    const date = new Date(isoDate.split('+')[0]);

    return new Intl.DateTimeFormat('ru-RU', {
        ...options,
        timeZone: 'Europe/Moscow'
    }).format(date).replace(',', '');
};

export const calculateTimeDifferenceFormated = (isoDate1, isoDate2) => {
    const date1 = new Date(isoDate1);
    const date2 = new Date(isoDate2);

    const diffMs = Math.abs(date1 - date2);

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    let result = "";

    if (diffDays > 0) {
        result += `${diffDays}д `;
    }

    if (diffHours > 0) {
        result += `${diffHours}ч `;
    }

    if (diffMinutes > 0) {
        result += `${diffMinutes}м`;
    }

    return result.trim();
};

export const getTransferTimes = (route) => {
    const segments = route.segments;

    if (!segments || segments.length <= 1) {
        return {
            time: null,
        };
    }

    let time = 0;

    for (let i = 1; i < segments.length; i++) {
        const prevFinish = new Date(segments[i - 1].finishDateTime);
        const nextStart = new Date(segments[i].startDateTime);

        const transferTime = (nextStart - prevFinish) / (1000);

        time = time + transferTime;
    }

    return {
        time: time
    };
};

export const getTripDuration = (route) => {
    if (!route?.startDateTime || !route?.finishDateTime) return null;

    const start = new Date(route.startDateTime);
    const finish = new Date(route.finishDateTime);

    return Math.abs((finish - start) / 1000);
};

export const calculateMinMaxPrice = (route) => {
    let minTotal = 0;
    let maxTotal = 0;

    for (const segment of route.segments) {
        const prices = segment.products.map(p => p.priceInKopecks);
        if (prices.length !== 0) {
            minTotal += Math.min(...prices);
            maxTotal += Math.max(...prices);
        }
    }

    if (minTotal === 0) {
        return {
            min: null,
            max: null
        }
    }

    return {
        min: minTotal / 100,
        max: maxTotal / 100
    };
}

export const getTransportTypes = (route) => {
    const transportTypes = new Set();

    if (route.segments && Array.isArray(route.segments)) {
        for (const segment of route.segments) {
            if (segment.transport) {
                transportTypes.add(segment.transport);
            }
        }
    }

    return transportTypes;
};

export const getCarriers = (route) => {
    const carriers = new Set();

    if (route.segments && Array.isArray(route.segments)) {
        for (const segment of route.segments) {
            if (segment.carrier) {
                carriers.add(segment.carrier);
            }
        }
    }

    return carriers;
};

export const getCarType = (type) => {
    switch (type) {
        case "COMPARTMENT":
            return "купе";
        case "RESERVED_SEAT":
            return "плацкарт";
        case "LUXURY":
            return "СВ";
        case "SOFT":
            return "люкс";
        case "SEDENTARY":
            return "сидячие";
        default:
            return type
    }
}

export const getPlaceType = (type) => {
    if (type === "Upper") return "Верхнее"
    else if (type === "Lower") return "Нижнее"
    else if (type === "SideUpper") return "Боковое верхнее"
    else if (type === "SideLower") return "Боковое нижнее"
    else if (type === "NoValue") return "Обычное место"
    else if (type === "NoTableBackward") return "Не у стола, против хода"
    else if (type === "NoTableForward") return "Не у стола, по ходу"
    else if (type === "NearTableBackward") return "У стола, против хода"
    else if (type === "NearTableForward") return "У стола, по хода"
    else if (type === "NoWindowBackward") return "Без окна, против хода"
    else if (type === "NoWindowForward") return "Без окна, по ходу"
    else if (type === "WithPets") return "Для пассажира с животным"
    else if (type === "WithChild") return "Для пассажира с детьми"
    else if (type === "SideUpperWithHigherLevelOfNoise") return "Боковое верхнее у туалета"
    else if (type === "SideLowerWithHigherLevelOfNoise") return "Боковое нижнее у туалета"
    else if (type === "LastCompartmentLowerWithHigherLevelOfNoise") return "Нижнее у туалета"
    else if (type === "LastCompartmentUpperWithHigherLevelOfNoise") return "Верхнее у туалета"
    else if (type.toLowerCase().includes("upper")) {
        console.debug(type)
        return "Верхнее"
    } else if (type.toLowerCase().includes("lower")) {
        console.debug(type)
        return "Нижнее"
    } else {
        console.debug(type)
        return null
    }
}