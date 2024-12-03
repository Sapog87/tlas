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

export const calculateTimeDifference = (isoDate1, isoDate2) => {
    const date1 = new Date(isoDate1);
    const date2 = new Date(isoDate2);

    const diffMs = Math.abs(date1 - date2);

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHours} ч ${diffMinutes} мин`;
};