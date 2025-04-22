import React, {useEffect, useRef, useState} from 'react';
import {tickets} from "../../api/TicketService";
import SvgRenderer from "./SvgRenderer";
import {calculateTimeDifferenceFormated, formatDate, getCarType} from "../../Utils";
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

    return (<div
        className="text-black fixed inset-0 bg-black bg-opacity-50 flex justify-center z-50">
        <div
            ref={modalRef}
            className="bg-white rounded-2xl w-[1000px] min-w-[1000px] h-[90vh] z-50 overflow-hidden mt-[5vh]"
        >
            <div className="p-6 overflow-y-auto h-[90vh] scroll">
                <div className="">
                    <div className="text-2xl p-2 mb-3 shadow-inner bg-gray-200 rounded-xl">
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
                        <div className="shadow-inner p-2 mb-3 bg-gray-200 rounded-xl">
                            <div className="text-2xl mb-2">
                                Тип выгона
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {coachTypes.map(coachType => (<button
                                    key={coachType}
                                    onClick={() => setType(coachType)}
                                    className={`px-4 py-2 rounded-xl ${type === coachType ? 'bg-[#96dbfa] text-white' : 'bg-gray-200'}`}
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
                </div>
                <div
                    className="space-y-[15px]"
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
                            return (
                                <div className="shadow-inner bg-gray-200 rounded-xl">
                                    <div className="px-5 py-2 text-2xl">
                                        Вагон {coach.number}
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
                                                                places={coach.freePlaces}
                                                            />
                                                        </div>
                                                    )
                                                } else {
                                                    return (
                                                        <div className="w-full px-5 py-4">
                                                            <ListRenderer places={coach.freePlaces} />
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
                                                                    places={coach.freePlaces}
                                                                />
                                                                <div className="text-xl">Этаж 1</div>
                                                                <SvgRenderer
                                                                    rawSvg={rawSvg1.svg}
                                                                    places={coach.freePlaces}
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                } else {
                                                    return (
                                                        <div className="flex justify-center">
                                                            <div>
                                                                <ListRenderer places={coach.freePlaces} />
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