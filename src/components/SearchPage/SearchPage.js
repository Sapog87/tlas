import React, {useEffect, useRef, useState} from 'react';
import Search from "../Search/Search";
import Header from "../Header/Header";
import Criteria from "../Criteria/Criteria";
import {getRzd, getYandex} from "../../api/RouteService";
import {calculateMinMaxPrice, getCarriers, getTransferTimes, getTransportTypes, getTripDuration} from "../../Utils";
import ResultArea from "../Result/ResultArea";
import Sort from "../Criteria/Sort";
import Footer from "../Footer/Footer";
import ProgressBar from "../ProgressBar/ProgressBar";
import SkeletonPlaceholder from "../../Skeleton/SkeletonPlaceholder";

function SearchPage({
                        logged,
                        setLogged,
                        setShowLoginModal,
                        user
                    }) {
    const [to, setTo] = useState({});
    const [from, setFrom] = useState({});
    const [toInput, setToInput] = useState("");
    const [fromInput, setFromInput] = useState("");

    const [outputReceived, setOutputReceived] = useState(false);
    const [loading, setLoading] = useState(false);
    const [networkError, setNetworkError] = useState(false);
    const [data, setData] = useState([]);
    const [shownData, setShownData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const [transferTimeRange, setTransferTimeRange] = useState(null);
    const [minTransferTimeRange, setMinTransferTimeRange] = useState(null);
    const [maxTransferTimeRange, setMaxTransferTimeRange] = useState(null);

    const [journeyTimeRange, setJourneyTimeRange] = useState(null);
    const [minJourneyTimeRange, setMinJourneyTimeRange] = useState(null);
    const [maxJourneyTimeRange, setMaxJourneyTimeRange] = useState(null);

    const [selectedTransfers, setSelectedTransfers] = useState({});

    const [priceRange, setPriceRange] = useState(null);
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);

    const [ascending, setAscending] = useState(true);
    const [selectedSort, setSelectedSort] = useState("duration");

    const [departureTimeRange, setDepartureTimeRange] = useState([0, 24]);
    const [arrivalTimeRange, setArrivalTimeRange] = useState([0, 24]);

    const [selectedTransport, setSelectedTransport] = useState({});

    const [selectedCarrier, setSelectedCarrier] = useState({});

    const abortControllerRef = useRef(null);

    const sortOptions = [
        {id: "duration", label: "Продолжительность"},
        {id: "price", label: "Цена"},
        {id: "departure", label: "Убытие"},
        {id: "arrival", label: "Прибытие"},
    ];

    const handleSearchSubmit = async (from, to, date) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;
        const signal = controller.signal;

        setData([])
        const formatedDate = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        setLoading(true);
        setOutputReceived(false);
        setNetworkError(false);
        setSelectedTransport({})
        setSelectedTransfers({})

        try {
            Promise.all(
                [
                    getRzd(from, to, formatedDate, signal)
                        .then(response => {
                            if (response.status === 200) {
                                return response.json()
                            } else {
                                return []
                            }
                        })
                        .then(data => {
                            setData(prev => [...prev, ...data]);
                        })
                        .catch((e) => {
                            setNetworkError(true);
                            console.error(e);
                        })
                        .finally(() => {
                                setOutputReceived(true)
                            }
                        ),
                    getYandex(from, to, formatedDate, signal)
                        .then(response => {
                            if (response.status === 200) {
                                return response.json()
                            } else {
                                return []
                            }
                        })
                        .then(data => {
                            setData(prev => [...prev, ...data]);
                        })
                        .catch((e) => {
                            setNetworkError(true);
                            console.error(e);
                        })
                        .finally(() => {
                                setOutputReceived(true)
                            }
                        )
                ])
                .finally(() => {
                    setLoading(false)
                });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (data.length === 0) return;

        let localMinTransfer = null;
        let localMaxTransfer = null;

        let localMinJourney = null;
        let localMaxJourney = null;

        let localMinPrice = null;
        let localMaxPrice = null;

        const transfers = new Set()
        const localTransports = new Set()
        const localCarriers = new Set()

        for (const item of data) {
            const {time: transferTime} = getTransferTimes(item);
            item["transferTime"] = transferTime;

            if (typeof transferTime === 'number') {
                if (localMinTransfer == null || Math.floor(transferTime / 3600) < localMinTransfer) {
                    localMinTransfer = Math.floor(transferTime / 3600);
                }
                if (localMaxTransfer == null || Math.ceil(transferTime / 3600) > localMaxTransfer) {
                    localMaxTransfer = Math.ceil(transferTime / 3600);
                }
            }

            //------

            const duration = getTripDuration(item);
            item["duration"] = duration;

            if (typeof duration === 'number') {
                if (localMinJourney == null || Math.floor(duration / 3600) < localMinJourney) {
                    localMinJourney = Math.floor(duration / 3600);
                }
                if (localMaxJourney == null || Math.ceil(duration / 3600) > localMaxJourney) {
                    localMaxJourney = Math.ceil(duration / 3600);
                }
            }

            //------

            transfers.add(item.transfers);

            //------

            const {min: minPrice, max: maxPrice} = calculateMinMaxPrice(item);
            item["minPrice"] = minPrice;
            item["maxPrice"] = maxPrice;

            if (typeof minPrice === 'number' && typeof maxPrice === 'number') {
                if (localMinPrice == null || Math.floor(minPrice) < localMinPrice) {
                    localMinPrice = Math.floor(minPrice);
                }
                if (localMaxPrice == null || Math.ceil(maxPrice) > localMaxPrice) {
                    localMaxPrice = Math.ceil(maxPrice);
                }
            }

            //------

            const transportSet = getTransportTypes(item);
            item["transport"] = transportSet;
            transportSet.forEach((item) => {
                localTransports.add(item)
            });

            //------

            const carrierSet = getCarriers(item);
            item["carrier"] = carrierSet;
            carrierSet.forEach((item) => {
                localCarriers.add(item)
            });
        }

        const state = Array.from(transfers).reduce((acc, value) => {
            acc[value] = selectedTransfers[value] ?? false;
            return acc;
        }, {});
        setSelectedTransfers(state);

        const transport = Array.from(localTransports).reduce((acc, value) => {
            acc[value] = selectedTransport[value] ?? false;
            return acc;
        }, {});
        setSelectedTransport(transport);

        const carriers = Array.from(localCarriers).reduce((acc, value) => {
            acc[value] = selectedCarrier[value] ?? false;
            return acc;
        }, {});
        setSelectedCarrier(carriers);

        setMinTransferTimeRange(localMinTransfer);
        setMaxTransferTimeRange(localMaxTransfer);

        setMinJourneyTimeRange(localMinJourney);
        setMaxJourneyTimeRange(localMaxJourney);

        setMinPrice(localMinPrice);
        setMaxPrice(localMaxPrice);

        if (localMinTransfer != null && localMaxTransfer != null) {
            setTransferTimeRange([localMinTransfer, localMaxTransfer]);
        } else {
            setTransferTimeRange(null);
        }

        if (localMinJourney != null && localMaxJourney != null) {
            setJourneyTimeRange([localMinJourney, localMaxJourney]);
        } else {
            setJourneyTimeRange(null);
        }

        if (localMinPrice != null && localMaxPrice != null) {
            setPriceRange([localMinPrice, localMaxPrice]);
        } else {
            setPriceRange(null);
        }
    }, [data])

    useEffect(() => {
        const allSelected = Object.values(selectedTransfers).every(value => value === true);
        const noneSelected = Object.values(selectedTransfers).every(value => value === false);

        const transport = new Set(Object.entries(selectedTransport).filter(([_, value]) => value).map(([key]) => key));
        const carrier = new Set(Object.entries(selectedCarrier).filter(([_, value]) => value).map(([key]) => key));

        const filtered = data
            .filter((t) =>
                !transferTimeRange || t.transfers === 0 ||
                Math.floor(t.transferTime / 3600) >= transferTimeRange[0] &&
                Math.ceil(t.transferTime / 3600) <= transferTimeRange[1]
            )
            .filter((t) =>
                !journeyTimeRange ||
                Math.floor(t.duration / 3600) >= journeyTimeRange[0] &&
                Math.ceil(t.duration / 3600) <= journeyTimeRange[1]
            )
            .filter((t) =>
                allSelected || noneSelected
                || selectedTransfers[t.transfers]
            )
            .filter((t) =>
                !priceRange ||
                priceRange[0] === minPrice && priceRange[1] === maxPrice ||
                Math.floor(t.minPrice) <= priceRange[1] && Math.ceil(t.maxPrice) >= priceRange[0]
            )
            .filter((t) =>
                transport.size === 0 || t.transport.isSubsetOf(transport)
            )
            .filter((t) =>
                carrier.size === 0 || t.carrier.isSubsetOf(carrier)
            )
            .filter((t) =>
                new Date(t.startDateTime).getHours() >= departureTimeRange[0] &&
                new Date(t.startDateTime).getHours() <= departureTimeRange[1]
            )
            .filter((t) =>
                new Date(t.finishDateTime).getHours() >= arrivalTimeRange[0] &&
                new Date(t.finishDateTime).getHours() <= arrivalTimeRange[1]
            );

        setFilteredData(filtered);
    }, [selectedCarrier, departureTimeRange, arrivalTimeRange, selectedTransport, priceRange, selectedTransfers, journeyTimeRange, transferTimeRange, data, minPrice, maxPrice]);

    useEffect(() => {
        const sorted = filteredData.toSorted((a, b) => {
            let result = 0;
            if (ascending) {
                if (selectedSort === "duration") {
                    result = a.duration - b.duration
                } else if (selectedSort === "price") {
                    if (a.minPrice == null) {
                        result = 1;
                    } else if (b.minPrice == null) {
                        result = -1;
                    } else {
                        result = a.minPrice - b.minPrice
                    }
                    console.log(a.minPrice, b.minPrice, result);
                } else if (selectedSort === "departure") {
                    result = new Date(a.startDateTime) - new Date(b.startDateTime)
                } else if (selectedSort === "arrival") {
                    result = new Date(a.finishDateTime) - new Date(b.finishDateTime)
                }
            } else {
                if (selectedSort === "duration") {
                    result = b.duration - a.duration
                } else if (selectedSort === "price") {
                    if (a.minPrice == null) {
                        result = 1;
                    } else {
                        result = b.minPrice - a.minPrice
                    }
                    console.log(b.minPrice, a.minPrice, result);
                } else if (selectedSort === "departure") {
                    result = new Date(b.startDateTime) - new Date(a.startDateTime)
                } else if (selectedSort === "arrival") {
                    result = new Date(b.finishDateTime) - new Date(a.finishDateTime)
                }
            }
            return result;
        });

        setShownData(sorted);
    }, [filteredData, ascending, selectedSort]);

    const handleTransferTimeRangeSliderChange = (value) => {
        if (value[0] !== value[1]) {
            setTransferTimeRange(value);
        }
    };

    const handleJourneyTimeRangeSliderChange = (value) => {
        if (value[0] !== value[1]) {
            setJourneyTimeRange(value);
        }
    };

    const handlePriceRangeSliderChange = (value) => {
        if (value[0] !== value[1]) {
            setPriceRange(value);
        }
    };

    const handleDepartureRangeSliderChange = (value) => {
        if (value[0] !== value[1]) {
            setDepartureTimeRange(value);
        }
    };

    const handleArrivalRangeSliderChange = (value) => {
        if (value[0] !== value[1]) {
            setArrivalTimeRange(value);
        }
    };

    const handleSelectedTransfersCheckboxChange = (event) => {
        const {name, checked} = event.target;

        setSelectedTransfers({
            ...selectedTransfers,
            [name]: checked,
        });
    };

    const handleSelectedTransportCheckboxChange = (event) => {
        const {name, checked} = event.target;

        setSelectedTransport({
            ...selectedTransport,
            [name]: checked,
        });
    };

    const handleSelectedCarrierCheckboxChange = (event) => {
        const {name, checked} = event.target;

        setSelectedCarrier({
            ...selectedCarrier,
            [name]: checked,
        });
    };

    return (
        <div>
            <Header
                logged={logged}
                setLogged={setLogged}
                setShowLoginModal={setShowLoginModal}
                user={user}
            />
            <div
                className="bg-orange-500 py-[30px]  shadow-[10px_10px_10px_#d4d4d4]"
            >
                <Search
                    handleSearchSubmit={handleSearchSubmit}
                    setData={setData}
                    setNetworkError={setNetworkError}
                    loading={loading}
                    setLoading={setLoading}
                    to={to}
                    setTo={setTo}
                    from={from}
                    setFrom={setFrom}
                    toInput={toInput}
                    setToInput={setToInput}
                    fromInput={fromInput}
                    setFromInput={setFromInput}
                />
            </div>
            <ProgressBar loading={loading}/>
            {(() => {
                if (outputReceived && !networkError && data.length > 0) {
                    return (
                        <div className="relative flex justify-center py-10">
                            <Criteria
                                minTransferTimeRange={minTransferTimeRange}
                                maxTransferTimeRange={maxTransferTimeRange}
                                transferTimeRange={transferTimeRange}
                                handleTransferTimeRangeSliderChange={handleTransferTimeRangeSliderChange}
                                minJourneyTimeRange={minJourneyTimeRange}
                                maxJourneyTimeRange={maxJourneyTimeRange}
                                journeyTimeRange={journeyTimeRange}
                                handleJourneyTimeRangeSliderChange={handleJourneyTimeRangeSliderChange}
                                selectedTransfers={selectedTransfers}
                                handleSelectedTransfersCheckboxChange={handleSelectedTransfersCheckboxChange}
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                priceRange={priceRange}
                                handlePriceRangeSliderChange={handlePriceRangeSliderChange}
                                selectedTransport={selectedTransport}
                                handleSelectedTransportCheckboxChange={handleSelectedTransportCheckboxChange}
                                departureTimeRange={departureTimeRange}
                                handleDepartureRangeSliderChange={handleDepartureRangeSliderChange}
                                arrivalTimeRange={arrivalTimeRange}
                                handleArrivalRangeSliderChange={handleArrivalRangeSliderChange}
                                selectedCarrier={selectedCarrier}
                                handleSelectedCarrierCheckboxChange={handleSelectedCarrierCheckboxChange}
                            />
                            <div className="ml-10 w-[70%] max-w-[1000px] min-w-[600px]">
                                <Sort
                                    ascending={ascending}
                                    setAscending={setAscending}
                                    selectedSort={selectedSort}
                                    setSelectedSort={setSelectedSort}
                                    sortOptions={sortOptions}
                                />
                                <ResultArea
                                    data={shownData}
                                />
                            </div>
                        </div>
                    )
                } else if (loading) {
                    return (
                        <SkeletonPlaceholder/>
                    )
                } else if (networkError) {
                    return (
                        <div className="relative flex justify-center py-10">
                            <div
                                className="bg-white rounded-[20px] w-[600px] h-[300px] shadow-[10px_10px_10px_#d4d4d4]">
                                <div className="p-10 flex justify-center">
                                    <svg width="100px" height="100px" viewBox="0 0 36 36"
                                         xmlns="http://www.w3.org/2000/svg"
                                         aria-hidden="true" role="img" className="iconify iconify--twemoji"
                                         preserveAspectRatio="xMidYMid meet">
                                        <path fill="#FFCC4D"
                                              d="M36 18c0 9.941-8.059 18-18 18c-9.94 0-18-8.059-18-18C0 8.06 8.06 0 18 0c9.941 0 18 8.06 18 18"></path>
                                        <ellipse fill="#664500" cx="11.5" cy="17" rx="2.5" ry="3.5"></ellipse>
                                        <ellipse fill="#664500" cx="24.5" cy="17" rx="2.5" ry="3.5"></ellipse>
                                        <path fill="#664500"
                                              d="M5.999 13.5a1 1 0 0 1-.799-1.6c3.262-4.35 7.616-4.4 7.8-4.4a1 1 0 0 1 .004 2c-.155.002-3.568.086-6.204 3.6a.998.998 0 0 1-.801.4zm24.002 0a.998.998 0 0 1-.801-.4c-2.641-3.521-6.061-3.599-6.206-3.6a1.002 1.002 0 0 1-.991-1.005A.997.997 0 0 1 23 7.5c.184 0 4.537.05 7.8 4.4a1 1 0 0 1-.799 1.6zm-6.516 14.879C23.474 28.335 22.34 24 18 24s-5.474 4.335-5.485 4.379a.496.496 0 0 0 .232.544a.51.51 0 0 0 .596-.06C13.352 28.855 14.356 28 18 28c3.59 0 4.617.83 4.656.863a.5.5 0 0 0 .829-.484z"></path>
                                        <path fill="#5DADEC"
                                              d="M16 31c0 2.762-2.238 5-5 5s-5-2.238-5-5s4-10 5-10s5 7.238 5 10z"></path>
                                    </svg>
                                </div>
                                <div className="text-2xl font-bold text-center">Что-то пошло не так</div>
                                <div className="text-xl text-center">
                                    Не удалось выполнить запрос, поробуйте еще раз.
                                </div>
                            </div>
                        </div>
                    )
                } else if (data) {
                    return (
                        <div className="relative flex justify-center py-10">
                            <div
                                className="bg-white rounded-[20px] w-[600px] h-[300px] shadow-[10px_10px_10px_#d4d4d4]">
                                <div className="p-10 flex justify-center">
                                    <svg width="100px" height="100px" viewBox="0 0 36 36"
                                         xmlns="http://www.w3.org/2000/svg"
                                         aria-hidden="true" role="img" className="iconify iconify--twemoji"
                                         preserveAspectRatio="xMidYMid meet">
                                        <circle fill="#FFCB4C" cx="18" cy="17.018" r="17"></circle>
                                        <path fill="#65471B"
                                              d="M14.524 21.036a.914.914 0 0 1-.312-.464a.799.799 0 0 1 .59-1.021c4.528-1.021 7.577 1.363 7.706 1.465c.384.306.459.845.173 1.205c-.286.358-.828.401-1.211.097c-.11-.084-2.523-1.923-6.182-1.098a.91.91 0 0 1-.764-.184z"></path>
                                        <ellipse fill="#65471B" cx="13.119" cy="11.174" rx="2.125" ry="2.656"></ellipse>
                                        <ellipse fill="#65471B" cx="24.375" cy="12.236" rx="2.125" ry="2.656"></ellipse>
                                        <path fill="#F19020"
                                              d="M17.276 35.149s1.265-.411 1.429-1.352c.173-.972-.624-1.167-.624-1.167s1.041-.208 1.172-1.376c.123-1.101-.861-1.363-.861-1.363s.97-.4 1.016-1.539c.038-.959-.995-1.428-.995-1.428s5.038-1.221 5.556-1.341c.516-.12 1.32-.615 1.069-1.694c-.249-1.08-1.204-1.118-1.697-1.003c-.494.115-6.744 1.566-8.9 2.068l-1.439.334c-.54.127-.785-.11-.404-.512c.508-.536.833-1.129.946-2.113c.119-1.035-.232-2.313-.433-2.809c-.374-.921-1.005-1.649-1.734-1.899c-1.137-.39-1.945.321-1.542 1.561c.604 1.854.208 3.375-.833 4.293c-2.449 2.157-3.588 3.695-2.83 6.973c.828 3.575 4.377 5.876 7.952 5.048l3.152-.681z"></path>
                                        <path fill="#65471B"
                                              d="M9.296 6.351a.925.925 0 0 1-.391-.399a.8.8 0 0 1 .393-1.112c4.266-1.831 7.699-.043 7.843.034c.433.231.608.747.391 1.154c-.216.405-.74.546-1.173.318c-.123-.063-2.832-1.432-6.278.047a.915.915 0 0 1-.785-.042zm12.135 3.75a.924.924 0 0 1-.362-.424a.8.8 0 0 1 .468-1.084c4.381-1.536 7.685.48 7.823.567c.415.26.555.787.312 1.178c-.242.39-.776.495-1.191.238c-.12-.072-2.727-1.621-6.267-.379a.924.924 0 0 1-.783-.096z"></path>
                                    </svg>
                                </div>
                                <div className="text-2xl font-bold text-center">Ничего не нашлось</div>
                                <div className="text-xl text-center">
                                    Попробуйте изменить конечную или начальную точку отправления, а может быть и дату
                                </div>
                            </div>
                        </div>
                    )
                }
            })()}
            <Footer/>
        </div>
    );
}

export default SearchPage;