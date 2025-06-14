import React, {useEffect, useReducer, useState} from 'react';
import Route from "./Route";
import Transfer from "./Transfer";
import TrainIcon from "../Icon/TrainIcon";
import PlaneIcon from "../Icon/PlaneIcon";
import SuburbanIcon from "../Icon/SuburbanIcon";
import {motion} from "framer-motion";
import Ticket from "./Ticket";
import {calculateTimeDifferenceFormated, formatDateWithoutOffset} from "../../Utils";
import BusIcon from "../Icon/BusIcon";
import {saveRoute} from "../../api/UserService";

function ResultArea({data, logged}) {
    const [showModal, setShowModal] = useState(false);
    const [request, setRequest] = useState({});
    const [trainData, setTrainData] = useState({});
    const [globallyDisabled, setGloballyDisabled] = useState(false);
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setGloballyDisabled(true);
        }, 10 * 60 * 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleClick = (event, index) => {
        saveRoute(data[index].key)
            .then(response => {
                if (response.status === 200) {
                    data[index]["isSaved"] = true;
                    forceUpdate()
                }
            })
            .catch((e) => {
                console.error(e);
            })
    };

    return (
        <div className="cursor-default">
            {!data || data.length === 0 && (
                <div className="bg-white rounded-[20px] mb-8 p-2.5 shadow-[10px_10px_10px_#d4d4d4]">
                    <div className="relative flex justify-center py-10">
                        <div>
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
                                Попробуйте изменить критерии поиска
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {data && data.length > 0 && data.map((item, index) => (
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                >
                    <div className="bg-white rounded-[20px] mb-8 p-2.5 shadow-[10px_10px_10px_#d4d4d4]">
                        <div className="p-2.5">
                            {(() => {
                                if (item.segments.length > 1) {
                                    return (
                                        <table className="w-full align-top">
                                            <tbody>
                                            <tr className="flex">
                                                <td className="w-[30%] p-2.5 align-top">
                                                    <div className="flex flex-wrap">
                                                        {item.segments.map(segment => {
                                                            if (segment.transport === "TRAIN") {
                                                                return (
                                                                    <div
                                                                        className="bg-[#e4e4e4] p-1 m-1 rounded-[5px] shadow-inner">
                                                                        <TrainIcon/>
                                                                    </div>
                                                                )
                                                            } else if (segment.transport === "PLANE") {
                                                                return (
                                                                    <div
                                                                        className="bg-[#e4e4e4] p-1 m-1 rounded-[5px] shadow-inner">
                                                                        <PlaneIcon/>
                                                                    </div>
                                                                )
                                                            } else if (segment.transport === "SUBURBAN") {
                                                                return (
                                                                    <div
                                                                        className="bg-[#e4e4e4] p-1 m-1 rounded-[5px] shadow-inner">
                                                                        <SuburbanIcon/>
                                                                    </div>
                                                                )
                                                            } else if (segment.transport === "BUS") {
                                                                return (
                                                                    <div
                                                                        className="bg-[#e4e4e4] p-1 m-1 rounded-[5px] shadow-inner">
                                                                        <BusIcon/>
                                                                    </div>
                                                                )
                                                            }
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="w-[35%] p-2.5 align-top">
                                                    <div>
                                                        <div className="flex justify-between">
                                                            <div className="text-left">
                                                                {(() => {
                                                                    const dt = formatDateWithoutOffset(item.startDateTime).split(' ')
                                                                    return (
                                                                        <div>
                                                                            <div
                                                                                className="text-xs">{dt[0]} {dt[1]}</div>
                                                                            <div className="font-bold">{dt[2]}</div>
                                                                        </div>
                                                                    )
                                                                })()}
                                                            </div>
                                                            <div className="text-[#a5a5a5] text-center">
                                                                {calculateTimeDifferenceFormated(item.startDateTime, item.finishDateTime)}
                                                            </div>
                                                            <div className="text-right">
                                                                {(() => {
                                                                    const dt = formatDateWithoutOffset(item.finishDateTime).split(' ')
                                                                    return (
                                                                        <div>
                                                                            <div
                                                                                className="text-xs">{dt[0]} {dt[1]}</div>
                                                                            <div className="font-bold">{dt[2]}</div>
                                                                        </div>
                                                                    )
                                                                })()}
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between gap-[50px]">
                                                            <div className="text-xs">
                                                                {item.startLocation}
                                                            </div>
                                                            <div className="text-xs text-right">
                                                                {item.finishLocation}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="w-[35%] p-2.5 align-top">
                                                    {item.minPrice && <div
                                                        className="bg-gray-200 flex justify-between shadow-inner m-1 p-1 rounded-[5px]">
                                                        <div className="text-[13px]">
                                                            стоимость
                                                        </div>
                                                        <div className="text-[14px] font-bold">
                                                            от {item.minPrice}₽
                                                        </div>
                                                    </div>}
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    )
                                }
                            })()}
                        </div>
                        {(() => {
                            return (
                                <>
                                    <div>
                                        {item.segments.map((segment, index) => {
                                            const nextSegment = item.segments[index + 1];
                                            const currentRoute = (
                                                <Route
                                                    transport={segment.transport}
                                                    raceNumber={segment.raceNumber}
                                                    carrier={segment.carrier}
                                                    startDateTime={segment.startDateTime}
                                                    startStation={segment.startStation}
                                                    startCity={segment.startCity}
                                                    finishDateTime={segment.finishDateTime}
                                                    finishStation={segment.finishStation}
                                                    finishCity={segment.finishCity}
                                                    products={segment.products}
                                                    vehicle={segment.vehicle}
                                                    setShowModal={setShowModal}
                                                    setRequest={setRequest}
                                                    setTrainData={setTrainData}
                                                    originCode={segment.originCode}
                                                    destinationCode={segment.destinationCode}
                                                />
                                            );

                                            const transfer =
                                                nextSegment && (
                                                    <Transfer
                                                        startStation={segment.finishStation}
                                                        finishStation={nextSegment.startStation}
                                                        startDateTime={segment.finishDateTime}
                                                        finishDateTime={nextSegment.startDateTime}
                                                        fromTransport={segment.transport}
                                                        toTransport={nextSegment.transport}
                                                    />
                                                );

                                            return (
                                                <div>
                                                    {currentRoute}
                                                    {transfer}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {logged && (
                                        <div className="">
                                            <button
                                                className="w-full mt-2 bg-[#a1ddf7] text-white px-6 py-1 rounded-xl hover:bg-[#6ecdfa] disabled:bg-blue-200 disabled:cursor-not-allowed"
                                                onClick={(event) => handleClick(event, index)}
                                                disabled={globallyDisabled || item["isSaved"] === true}
                                            >
                                                {globallyDisabled === true
                                                    ? item["isSaved"] === true
                                                        ? "Сохранено" : "Сохранить"
                                                    : item["isSaved"] === true
                                                        ? "Сохранено" : "Сохранить"
                                                }
                                            </button>
                                        </div>
                                    )}
                                </>
                            )
                        })()}
                    </div>
                </motion.div>
            ))}
            {showModal &&
                <Ticket
                    showModal={showModal}
                    setShowModal={setShowModal}
                    request={request}
                    trainData={trainData}
                />
            }
        </div>
    );
}

export default ResultArea;
