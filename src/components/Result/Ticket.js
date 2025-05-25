import React, {useEffect, useRef, useState} from 'react';
import {tickets} from "../../api/TicketService";
import SvgRenderer from "./SvgRenderer";
import {calculateTimeDifferenceFormated, formatDate, getCarType, getPlaceType} from "../../Utils";
import SkeletonCoach from "../Skeleton/SkeletonCoach";
import ListRenderer from "./ListRenderer";

function Ticket({
                    showModal,
                    setShowModal,
                    request,
                    trainData
                }) {
    const modalRef = useRef(null);
    const [data, setData] = useState(null);
    const [type, setType] = useState(null);
    const [place, setPlace] = useState(null);
    const [placeTypes, setPlaceTypes] = useState("All");

    const coachTypes = data ? [...new Set(data.coaches.map(coach => coach.carType))] : [];

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showModal]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowModal(false);
            }
        };

        if (showModal) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showModal]);

    useEffect(() => {
        console.log(request)
        tickets(request.origin, request.destination, request.date, request.train)
            .then(response => {
                if (response.status === 200) {
                    return response.json()
                } else {
                    throw new Error("Failed to fetch request: " + response.status);
                }
            })
            .then(json => {
                setData(json)
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {

            });
    }, [request]);

    useEffect(() => {
        setType(coachTypes[0])
    }, [data]);

    useEffect(() => {
        const t = data
            ? (() => {
                const types = data.coaches
                    .filter(coach => coach.carType === type)
                    .map(coach => coach.freePlaces)
                    .flat()
                    .map(place => place.type);
                const noDuplicates = [...new Set(types)]

                return noDuplicates.length === 1 ? noDuplicates : ["All"].concat(noDuplicates);
            })()
            : [];
        setPlaceTypes(t);
        setPlace(t[0]);
    }, [type]);

    return (<div
        className="text-black fixed inset-0 bg-black bg-opacity-50 flex justify-center z-50">
        <div
            ref={modalRef}
            className="bg-white rounded-2xl w-[1000px] min-w-[1000px] h-[90vh] z-50 overflow-hidden mt-[5vh]"
        >
            <div className="p-5 overflow-y-auto h-[90vh] scroll scrollbar-hide">
                <div className="">
                    <div className="text-2xl p-3 mb-3 shadow-inner bg-gray-200 rounded-xl">
                        <div className="p-2">
                            {trainData.startCity} — {trainData.finishCity}
                        </div>
                        <table className="w-full">
                            <tbody>
                            <tr className="flex">
                                <td className="w-[40%] p-2.5 align-middle">
                                    <div>
                                        {trainData.carrier}
                                    </div>
                                    <div className="text-[16px] text-gray-500">
                                        Поезд {trainData.raceNumber}{trainData.vehicle &&
                                        <span>, «{trainData.vehicle}»</span>}
                                    </div>
                                </td>
                                <td className="w-[20%] p-2.5 align-top">
                                    <div>
                                        <div>
                                            {(() => {
                                                const dt = formatDate(trainData.startDateTime).split(' ')
                                                return (
                                                    <div>
                                                        <div className="text-xl">{dt[0]} {dt[1]}</div>
                                                        <div className="font-bold">{dt[2]}</div>
                                                    </div>
                                                )
                                            })()}
                                        </div>
                                        <span/>
                                        <div className="text-[16px]/[20px] text-">
                                            {trainData.startStation}
                                        </div>
                                    </div>
                                </td>
                                <td className="w-[20%] py-2.5">
                                    <div className="text-[#888888] text-center">
                                        <div>{calculateTimeDifferenceFormated(trainData.startDateTime, trainData.finishDateTime)}</div>
                                    </div>
                                </td>
                                <td className="w-[20%] p-2.5 align-top text-right">
                                    <div>
                                        <div>
                                            {(() => {
                                                const dt = formatDate(trainData.finishDateTime).split(' ')
                                                return (
                                                    <div>
                                                        <div className="text-xl">{dt[0]} {dt[1]}</div>
                                                        <div className="font-bold">{dt[2]}</div>
                                                    </div>
                                                )
                                            })()}
                                        </div>
                                        <span/>
                                        <div className="text-[16px]/[20px]">
                                            {trainData.finishStation}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    {data &&
                        <div className="shadow-inner p-5 mb-3 bg-gray-200 rounded-xl">
                            <div className="text-2xl mb-2">
                                Тип выгона
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {coachTypes.map(coachType => (<button
                                    key={coachType}
                                    onClick={() => setType(coachType)}
                                    className={`px-4 py-2 rounded-xl transition ${type === coachType ? 'bg-[#96dbfa] text-white shadow-inner' : 'bg-gray-200'}`}
                                >
                                    <div>
                                        <span className="capitalize">
                                            {getCarType(coachType)} — {data && data.coaches.filter(coach => coach.carType === coachType).reduce((accumulator, currentValue) => accumulator + currentValue.freePlaces.length, 0)}
                                        </span>
                                    </div>
                                </button>))}
                            </div>
                        </div>
                    }
                    {data &&
                        <div className="shadow-inner p-5 mb-3 bg-gray-200 rounded-xl">
                            <div className="text-2xl mb-2">
                                Тип места
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {placeTypes.map(placeType => (<button
                                    key={placeType}
                                    onClick={() => {
                                        setPlace(placeType);
                                        console.log(placeType)
                                    }}
                                    className={`px-4 py-2 rounded-xl transition ${place === placeType ? 'bg-[#96dbfa] text-white shadow-inner' : 'bg-gray-200'}`}
                                >
                                    <div>
                                        <span>
                                            {placeType === "All" ? "Любое" : getPlaceType(placeType)}
                                        </span>
                                    </div>
                                </button>))}
                            </div>
                        </div>
                    }
                </div>
                <div
                    className="space-y-[12px]"
                >
                    {!data &&
                        <div>
                            <SkeletonCoach/>
                            <SkeletonCoach/>
                            <SkeletonCoach/>
                            <SkeletonCoach/>
                        </div>
                    }
                    {data && data.coaches
                        .filter(coach => coach.carType === type)
                        .map((coach) => {
                            const places = coach.freePlaces.filter(p => p.type === place || place === "All");
                            const minPrice = Math.min(...places.map(x => x.kopecks)) / 100.0
                            if (places.length === 0) {
                                return null;
                            }
                            return (
                                <div className="shadow-inner bg-gray-200 rounded-xl">
                                    <div className="px-5 py-2 text-2xl">
                                        <span className="font-bold">Вагон {coach.number}</span> {minPrice &&
                                        <span className="text-xl">от {minPrice}₽</span>}
                                    </div>
                                    {(() => {
                                        if (coach.schemeName != null) {
                                            if (coach.isTwoStorey === false) {
                                                const rawSvg = data.schemes.find(e => e.name === coach.schemeName && e.isFirstStorey === true)
                                                if (rawSvg) {
                                                    return (
                                                        <div className="flex justify-center">
                                                            <SvgRenderer
                                                                rawSvg={rawSvg.svg}
                                                                places={places}
                                                            />
                                                        </div>
                                                    )
                                                } else {
                                                    return (
                                                        <div className="w-full px-5 py-4">
                                                            <ListRenderer places={places}/>
                                                        </div>
                                                    )
                                                }
                                            } else {
                                                const rawSvg1 = data.schemes.find(e => e.name === coach.schemeName && e.isFirstStorey === true)
                                                const rawSvg2 = data.schemes.find(e => e.name === coach.schemeName && e.isFirstStorey === false)
                                                if (rawSvg1 && rawSvg2) {
                                                    return (
                                                        <div className="flex justify-center">
                                                            <div>
                                                                <div className="text-xl">Этаж 2</div>
                                                                <SvgRenderer
                                                                    rawSvg={rawSvg2.svg}
                                                                    places={places}
                                                                />
                                                                <div className="text-xl">Этаж 1</div>
                                                                <SvgRenderer
                                                                    rawSvg={rawSvg1.svg}
                                                                    places={places}
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                } else {
                                                    return (
                                                        <div className="flex justify-center">
                                                            <div>
                                                                <ListRenderer places={places}/>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            }
                                        } else {
                                            if (coach.isTwoStorey === false) {
                                                return (
                                                    <div className="flex justify-center">
                                                        нет схемы
                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <div className="flex justify-center">
                                                        <div>
                                                            <div className="text-xl">Этаж 2</div>
                                                            <div>нет схемы</div>
                                                            <div className="text-xl">Этаж 1</div>
                                                            <div>нет схемы</div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        }
                                    })()}
                                </div>
                            )
                        })}
                </div>
            </div>
        </div>
    </div>);
}

export default Ticket;