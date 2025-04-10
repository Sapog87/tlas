import React, {useEffect, useState} from 'react';
import Search from "../Search/Search";
import Header from "../Header/Header";
import Criteria from "../Criteria/Criteria";
import {getTrains} from "../../api/RouteService";
import {calculateMinMaxPrice, getTransferTimes, getTransportTypes, getTripDuration} from "../../Utils";
import ResultArea from "../Result/ResultArea";
import Sort from "../Criteria/Sort";

function SearchPage({}) {
    const [outputReceived, setOutputReceived] = useState(false);
    const [loading, setLoading] = useState(false);
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

    const sortOptions = [
        {id: "duration", label: "Продолжительность"},
        {id: "price", label: "Цена"},
        {id: "departure", label: "Убытие"},
        {id: "arrival", label: "Прибытие"},
    ];

    const [selectedTransport, setSelectedTransport] = useState({});

    const handleSearchSubmit = async (from, to, date) => {
        setData([])
        const formatedDate = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        setOutputReceived(false);
        setLoading(true)
        try {
            getTrains(from, to, formatedDate)
                .then(response => {
                    if (response.status === 200) {
                        return response.json()
                    } else {
                        console.log(response);
                        return []
                    }
                })
                .then(data => {
                    setData(prev => [...prev, ...data]);
                })
                .finally(() => {
                    setLoading(false)
                    setOutputReceived(true);
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

        for (const item of data) {
            const {min: minTransferTime, max: maxTransferTime} = getTransferTimes(item);
            item["minTransferTime"] = minTransferTime;
            item["maxTransferTime"] = maxTransferTime;

            if (typeof minTransferTime === 'number' && typeof maxTransferTime === 'number') {
                if (localMinTransfer == null || Math.floor(minTransferTime / 3600) < localMinTransfer) {
                    localMinTransfer = Math.floor(minTransferTime / 3600);
                }
                if (localMaxTransfer == null || Math.ceil(maxTransferTime / 3600) > localMaxTransfer) {
                    localMaxTransfer = Math.ceil(maxTransferTime / 3600);
                    console.log(maxTransferTime, localMaxTransfer);
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

        const filtered = data
            .filter((t) =>
                !transferTimeRange || t.transfers === 0 ||
                Math.floor(t.minTransferTime / 3600) >= transferTimeRange[0] &&
                Math.ceil(t.maxTransferTime / 3600) <= transferTimeRange[1]
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
                Math.floor(t.minPrice) <= priceRange[1] &&
                Math.ceil(t.maxPrice) >= priceRange[0]
            )
            .filter((t) =>
                transport.size === 0 || t.transport.isSubsetOf(transport)
            )
            .filter((t) =>
                new Date(t.startDateTime).getHours() >= departureTimeRange[0] &&
                new Date(t.startDateTime).getHours() <= departureTimeRange[1]
            )
            .filter((t) =>
                new Date(t.finishDateTime).getHours() >= arrivalTimeRange[0] &&
                new Date(t.finishDateTime).getHours() <= arrivalTimeRange[1]
            )
        ;

        setFilteredData(filtered);
    }, [departureTimeRange, arrivalTimeRange, selectedTransport, priceRange, selectedTransfers, journeyTimeRange, transferTimeRange, data]);

    useEffect(() => {
        const sorted = filteredData.toSorted((a, b) => {
            let result = 0;
            if (ascending) {
                if (selectedSort === "duration") {
                    result = a.duration - b.duration
                } else if (selectedSort === "price") {
                    result = a.minPrice - b.minPrice
                } else if (selectedSort === "departure") {
                    result = new Date(a.startDateTime) - new Date(b.startDateTime)
                } else if (selectedSort === "arrival") {
                    result = new Date(a.finishDateTime) - new Date(b.finishDateTime)
                }
            } else {
                if (selectedSort === "duration") {
                    result = b.duration - a.duration
                } else if (selectedSort === "price") {
                    result = b.minPrice - a.minPrice
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

    return (
        <div>
            <Header/>
            <div
                className="bg-[#e26d00] py-[30px]  shadow-[10px_10px_10px_#d4d4d4]"
            >
                <Search handleSearchSubmit={handleSearchSubmit}/>
            </div>
            {(() => {
                if (outputReceived && data.length > 0) {
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
                        <div className="relative flex pt-2 justify-center">
                            <img src="loading.gif" alt="Loading..." width="75px" height="75px"/>
                        </div>
                    )
                } else {
                    return (
                        <div className="relative flex justify-center py-10">
                            <div
                                className="bg-white rounded-[20px] w-[600px] h-[300px] shadow-[10px_10px_10px_#d4d4d4]">
                                <div className="p-10 flex justify-center">
                                    <svg width="100px" height="100px" viewBox="0 0 36 36"
                                         xmlns="http://www.w3.org/2000/svg"
                                         aria-hidden="true" role="img" class="iconify iconify--twemoji"
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
        </div>
    );
}

export default SearchPage;