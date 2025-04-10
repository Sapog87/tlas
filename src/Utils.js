export const formatDate = (isoDate) => {
    const date = new Date(isoDate);

    const options = {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: 'numeric',
    };

    return new Intl.DateTimeFormat('ru-RU', options).format(date).replace(',', '');
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
            min: null,
            max: null
        };
    }

    let minTransfer = Infinity;
    let maxTransfer = -Infinity;

    for (let i = 1; i < segments.length; i++) {
        const prevFinish = new Date(segments[i - 1].finishDateTime);
        const nextStart = new Date(segments[i].startDateTime);

        const transferTime = (nextStart - prevFinish) / (1000);

        minTransfer = Math.min(minTransfer, transferTime);
        maxTransfer = Math.max(maxTransfer, transferTime);
    }

    return {
        min: minTransfer,
        max: maxTransfer
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
        minTotal += Math.min(...prices);
        maxTotal += Math.max(...prices);

    }

    return {
        min: parseInt(minTotal) / 100,
        max: parseInt(maxTotal) / 100
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