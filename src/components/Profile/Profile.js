import React, {useEffect, useState} from 'react';
import Header from "../Header/Header";
import {motion} from "framer-motion";
import TrainIcon from "../Icon/TrainIcon";
import PlaneIcon from "../Icon/PlaneIcon";
import SuburbanIcon from "../Icon/SuburbanIcon";
import BusIcon from "../Icon/BusIcon";
import {calculateTimeDifferenceFormated, formatDateWithoutOffset} from "../../Utils";
import {deleteRoute, getSavedRoutes} from "../../api/UserService";
import History from "../SearchPage/History";
import RouteNoProducts from "../Result/RouteNoProducts";
import TransferNoProducts from "../Result/TransferNoProducts";
import {useNavigate} from "react-router-dom";
import Footer from "../Footer/Footer";
import Skeleton from "react-loading-skeleton";

function Profile({
                     logged,
                     setLogged,
                     setShowLoginModal,
                     user
                 }) {
    const [data, setData] = useState([]);
    const [outputReceived, setOutputReceived] = useState(false);
    const [loading, setLoading] = useState(false);
    const [networkError, setNetworkError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (logged === true) {
            setLoading(true);
            getSavedRoutes(0, 1000)
                .then(response => {
                    if (response.status === 200) {
                        return response.json()
                    } else {
                        return []
                    }
                })
                .then(data => {
                    setData([])
                    setData(prev => [...prev, ...data]);
                })
                .catch((e) => {
                    setNetworkError(true);
                    console.error(e);
                })
                .finally(() => {
                        setLoading(false);
                        setOutputReceived(true)
                    }
                )
        }
    }, [logged]);

    const handleClick = (index) => {
        deleteRoute(data[index].key)
            .then(response => {
                if (response.status === 200) {
                    setData(data.filter((item, i) => i !== index))
                }
            })
            .catch((e) => {
                setNetworkError(true);
                console.error(e);
            })
    }

    const handleHistoryCallback = (item) => {
        const params = new URLSearchParams();
        if (item.from) params.append("from", item.from);
        if (item.to) params.append("to", item.to);
        const dateOnly = new Date().toLocaleDateString().split("/");
        console.log(dateOnly);
        params.append("date", `${dateOnly[2]}-${dateOnly[0].padStart(2,'0')}-${dateOnly[1]}`);
        navigate(`/search?${params.toString()}`)
    }

    return (
        <div>
            <div
                className="fixed z-20 w-full min-w-[900px] shadow-[10px_10px_10px_#d4d4d4]"
            >
                <Header
                    logged={logged}
                    setLogged={setLogged}
                    setShowLoginModal={setShowLoginModal}
                    user={user}
                />
            </div>
            <div className="mt-[100px]">
                <div className="relative flex justify-center">
                    <div
                        className="w-[20%] max-w-[600px] min-w-[400px] space-y-10 mb-10">
                        <div className="bg-white p-5 rounded-2xl shadow-[10px_10px_10px_#d4d4d4] space-y-2">
                            {logged && user && (<>
                                <div className="font-bold mb-2 text-xl flex items-center gap-2">
                                    <div>Профиль</div>
                                </div>
                                <hr/>
                                <div className="space-y-2">
                                    <div>Имя: {user.name}</div>
                                    <div>Логин: {user.username}</div>
                                    <div>Дата
                                        регистрации: {user.registrationDate === null ? "???" : user.registrationDate.split('T')[0]}</div>
                                </div>
                                <button
                                    className="w-full font-bold border border-red-500 text-red-500 hover:bg-gray-100 rounded-md px-2 py-1 text-sm"
                                    onClick={() => {
                                        localStorage.removeItem("token");
                                        setLogged(false);
                                        navigate("/")
                                    }}
                                >
                                    Выйти
                                </button>
                            </>)}
                            {!logged && (
                                <div className="text-center p-10">
                                    <div className="flex justify-center mb-2">
                                        <svg width="80px" height="80px"
                                             viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd"
                                                  d="M5.07692 5.92648C5.07692 4.38908 6.33971 3.14278 7.89744 3.14278H12C12.4248 3.14278 12.7692 3.48268 12.7692 3.90197C12.7692 4.32126 12.4248 4.66116 12 4.66116H7.89744C7.18938 4.66116 6.61539 5.22766 6.61539 5.92648V6.93873C6.61539 7.35802 6.27099 7.69792 5.84615 7.69792C5.42132 7.69792 5.07692 7.35802 5.07692 6.93873V5.92648ZM5.84615 16.3021C6.27099 16.3021 6.61539 16.642 6.61539 17.0613V18.0735C6.61539 18.7723 7.18938 19.3388 7.89744 19.3388H12C12.4248 19.3388 12.7692 19.6788 12.7692 20.098C12.7692 20.5173 12.4248 20.8572 12 20.8572H7.89744C6.33971 20.8572 5.07692 19.6109 5.07692 18.0735V17.0613C5.07692 16.642 5.42132 16.3021 5.84615 16.3021Z"
                                                  fill="#030D45"/>
                                            <path fillRule="evenodd" clipRule="evenodd"
                                                  d="M12.7692 4.78618C12.7692 3.90491 13.6592 3.29355 14.4966 3.59962L19.6248 5.47416C20.1277 5.658 20.4615 6.13139 20.4615 6.66071V17.3393C20.4615 17.8686 20.1277 18.342 19.6248 18.5258L14.4966 20.4004C13.6592 20.7065 12.7692 20.0951 12.7692 19.2138V4.78618ZM15.0309 2.17576C13.1887 1.5024 11.2308 2.84738 11.2308 4.78618V19.2138C11.2308 21.1526 13.1887 22.4976 15.0309 21.8242L20.1591 19.9497C21.2656 19.5452 22 18.5038 22 17.3393V6.66071C22 5.4962 21.2656 4.45475 20.1591 4.0503L15.0309 2.17576Z"
                                                  fill="#030D45"/>
                                            <path fillRule="evenodd" clipRule="evenodd"
                                                  d="M6.32787 9.43867C6.62827 9.14218 7.11532 9.14218 7.41572 9.43867L9.46701 11.4632C9.76741 11.7597 9.76741 12.2403 9.46701 12.5368L7.41572 14.5613C7.11532 14.8578 6.62827 14.8578 6.32787 14.5613C6.02746 14.2649 6.02746 13.7842 6.32787 13.4877L7.06599 12.7592H2.76923C2.3444 12.7592 2 12.4193 2 12C2 11.5807 2.3444 11.2408 2.76923 11.2408H7.06599L6.32787 10.5123C6.02746 10.2158 6.02746 9.73515 6.32787 9.43867Z"
                                                  fill="#030D45"/>
                                        </svg>
                                    </div>
                                    <div className="font-bold text-[18px]">Войдите, чтобы получить доступ к профилю
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-[10px_10px_10px_#d4d4d4]">
                            {logged && (
                                <div>
                                    <div className="font-bold mb-2 text-xl flex items-center gap-2">
                                        <div>История поиска</div>
                                    </div>
                                    <hr/>
                                    <History
                                        callback={handleHistoryCallback}
                                    />
                                </div>
                            )}
                            {!logged && (
                                <div className="text-center p-10">
                                    <div className="flex justify-center mb-2">
                                        <svg width="80px" height="80px"
                                             viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd"
                                                  d="M5.07692 5.92648C5.07692 4.38908 6.33971 3.14278 7.89744 3.14278H12C12.4248 3.14278 12.7692 3.48268 12.7692 3.90197C12.7692 4.32126 12.4248 4.66116 12 4.66116H7.89744C7.18938 4.66116 6.61539 5.22766 6.61539 5.92648V6.93873C6.61539 7.35802 6.27099 7.69792 5.84615 7.69792C5.42132 7.69792 5.07692 7.35802 5.07692 6.93873V5.92648ZM5.84615 16.3021C6.27099 16.3021 6.61539 16.642 6.61539 17.0613V18.0735C6.61539 18.7723 7.18938 19.3388 7.89744 19.3388H12C12.4248 19.3388 12.7692 19.6788 12.7692 20.098C12.7692 20.5173 12.4248 20.8572 12 20.8572H7.89744C6.33971 20.8572 5.07692 19.6109 5.07692 18.0735V17.0613C5.07692 16.642 5.42132 16.3021 5.84615 16.3021Z"
                                                  fill="#030D45"/>
                                            <path fillRule="evenodd" clipRule="evenodd"
                                                  d="M12.7692 4.78618C12.7692 3.90491 13.6592 3.29355 14.4966 3.59962L19.6248 5.47416C20.1277 5.658 20.4615 6.13139 20.4615 6.66071V17.3393C20.4615 17.8686 20.1277 18.342 19.6248 18.5258L14.4966 20.4004C13.6592 20.7065 12.7692 20.0951 12.7692 19.2138V4.78618ZM15.0309 2.17576C13.1887 1.5024 11.2308 2.84738 11.2308 4.78618V19.2138C11.2308 21.1526 13.1887 22.4976 15.0309 21.8242L20.1591 19.9497C21.2656 19.5452 22 18.5038 22 17.3393V6.66071C22 5.4962 21.2656 4.45475 20.1591 4.0503L15.0309 2.17576Z"
                                                  fill="#030D45"/>
                                            <path fillRule="evenodd" clipRule="evenodd"
                                                  d="M6.32787 9.43867C6.62827 9.14218 7.11532 9.14218 7.41572 9.43867L9.46701 11.4632C9.76741 11.7597 9.76741 12.2403 9.46701 12.5368L7.41572 14.5613C7.11532 14.8578 6.62827 14.8578 6.32787 14.5613C6.02746 14.2649 6.02746 13.7842 6.32787 13.4877L7.06599 12.7592H2.76923C2.3444 12.7592 2 12.4193 2 12C2 11.5807 2.3444 11.2408 2.76923 11.2408H7.06599L6.32787 10.5123C6.02746 10.2158 6.02746 9.73515 6.32787 9.43867Z"
                                                  fill="#030D45"/>
                                        </svg>
                                    </div>
                                    <div className="font-bold text-[18px]">Войдите, чтобы получить доступ к истории
                                        поиска и
                                        избранным
                                        маршрутам
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="ml-10 w-[70%] max-w-[800px] min-w-[500px]">
                        {logged && (
                            <>
                                <div
                                    className="bg-white font-bold text-2xl rounded-2xl mb-8 p-5 shadow-[10px_10px_10px_#d4d4d4]">
                                    Сохраненные маршруты
                                </div>
                                {(() => {
                                    if (outputReceived && !networkError && data.length > 0) {
                                        return (
                                            <>
                                                {data && data.length > 0 && data.map((item, index) => (
                                                    <motion.div
                                                        initial={{opacity: 0, y: 20}}
                                                        animate={{opacity: 1, y: 0}}
                                                        transition={{duration: 0.5}}
                                                    >
                                                        <div
                                                            className="bg-white rounded-[20px] mb-8 p-2.5 shadow-[10px_10px_10px_#d4d4d4]">
                                                            <div className="p-2.5">
                                                                {(() => {
                                                                    if (item.segments.length > 1) {
                                                                        return (
                                                                            <table className="w-full align-top">
                                                                                <tbody>
                                                                                <tr className="flex">
                                                                                    <td className="w-[40%] p-2.5 align-top">
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
                                                                                    <td className="w-[60%] p-2.5 align-top">
                                                                                        <div>
                                                                                            <div
                                                                                                className="flex justify-between">
                                                                                                <div
                                                                                                    className="text-left">
                                                                                                    {(() => {
                                                                                                        const dt = formatDateWithoutOffset(item.startDateTime).split(' ')
                                                                                                        return (
                                                                                                            <div>
                                                                                                                <div
                                                                                                                    className="text-xs">{dt[0]} {dt[1]}</div>
                                                                                                                <div
                                                                                                                    className="font-bold">{dt[2]}</div>
                                                                                                            </div>
                                                                                                        )
                                                                                                    })()}
                                                                                                </div>
                                                                                                <div
                                                                                                    className="text-[#a5a5a5] text-center">
                                                                                                    {calculateTimeDifferenceFormated(item.startDateTime, item.finishDateTime)}
                                                                                                </div>
                                                                                                <div
                                                                                                    className="text-right">
                                                                                                    {(() => {
                                                                                                        const dt = formatDateWithoutOffset(item.finishDateTime).split(' ')
                                                                                                        return (
                                                                                                            <div>
                                                                                                                <div
                                                                                                                    className="text-xs">{dt[0]} {dt[1]}</div>
                                                                                                                <div
                                                                                                                    className="font-bold">{dt[2]}</div>
                                                                                                            </div>
                                                                                                        )
                                                                                                    })()}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div
                                                                                                className="flex justify-between gap-[50px]">
                                                                                                <div
                                                                                                    className="text-xs">
                                                                                                    {item.startLocation}
                                                                                                </div>
                                                                                                <div
                                                                                                    className="text-xs text-right">
                                                                                                    {item.finishLocation}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        )
                                                                    }
                                                                })()}
                                                            </div>
                                                            <div>
                                                                {item.segments.map((segment, index) => {
                                                                    const nextSegment = item.segments[index + 1];
                                                                    const currentRoute = (
                                                                        <RouteNoProducts
                                                                            transport={segment.transport}
                                                                            raceNumber={segment.raceNumber}
                                                                            carrier={segment.carrier}
                                                                            startDateTime={segment.startDateTime}
                                                                            startStation={segment.startStation}
                                                                            startCity={segment.startCity}
                                                                            finishDateTime={segment.finishDateTime}
                                                                            finishStation={segment.finishStation}
                                                                            finishCity={segment.finishCity}
                                                                            vehicle={segment.vehicle}
                                                                        />
                                                                    );

                                                                    const transfer =
                                                                        nextSegment && (
                                                                            <TransferNoProducts
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
                                                                <div className="">
                                                                    <button
                                                                        className="w-full bg-[#96dbfa] text-white px-6 py-1 rounded-xl mt-2 hover:bg-[#5fccff]"
                                                                        onClick={() => handleClick(index)}
                                                                    >
                                                                        Удалить
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}</>
                                        )
                                    } else if (loading) {
                                        return (<>
                                            {[...Array(1)].map((_, idx) => (
                                                <div
                                                    className="bg-white rounded-[20px] mb-8 p-2.5 shadow-[10px_10px_10px_#d4d4d4]">
                                                    <div className="p-2.5">
                                                        <table className="w-full align-top">
                                                            <tbody>
                                                            <tr className="flex">
                                                                {/* Иконки транспорта */}
                                                                <td className="w-[30%] p-2.5 align-top">
                                                                    <div className="flex gap-2">
                                                                        <Skeleton width={40} height={40}/>
                                                                        <Skeleton width={40} height={40}/>
                                                                    </div>
                                                                </td>

                                                                {/* Отправление */}
                                                                <td className="w-[20%] p-2.5 align-top">
                                                                    <div className="mb-1"><Skeleton width={50}
                                                                                                    height={14}/></div>
                                                                    <div className="mb-1"><Skeleton width={60}
                                                                                                    height={20}/></div>
                                                                    <div><Skeleton width={70} height={14}/></div>
                                                                </td>

                                                                {/* Длительность */}
                                                                <td className="w-[30%] p-2.5 text-center">
                                                                    <Skeleton width={80} height={16}/>
                                                                </td>

                                                                {/* Прибытие */}
                                                                <td className="w-[20%] p-2.5 align-top">
                                                                    <div className="mb-1"><Skeleton width={50}
                                                                                                    height={14}/></div>
                                                                    <div className="mb-1"><Skeleton width={60}
                                                                                                    height={20}/></div>
                                                                    <div><Skeleton width={70} height={14}/></div>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <div
                                                        className="bg-[#e4e4e4] shadow-inner p-2.5 rounded-[10px] mb-2.5">
                                                        <table className="w-full">
                                                            <tbody>
                                                            <tr className="flex">
                                                                <td className="w-[30%] p-2.5 align-top">
                                                                    <Skeleton width={`70%`} height={20}
                                                                              className="mb-2"/>
                                                                    <Skeleton width={`90%`} height={14}
                                                                              className="mb-1"/>
                                                                    <Skeleton width={`80%`} height={14}/>
                                                                </td>
                                                                <td className="w-[20%] p-2.5 align-top">
                                                                    <Skeleton width={60} height={14} className="mb-1"/>
                                                                    <Skeleton width={50} height={20} className="mb-1"/>
                                                                    <Skeleton width={70} height={14}/>
                                                                </td>
                                                                <td className="w-[30%] p-2.5 text-center">
                                                                    <Skeleton width={80} height={16}/>
                                                                </td>
                                                                <td className="w-[20%] p-2.5 align-top">
                                                                    <Skeleton width={60} height={14} className="mb-1"/>
                                                                    <Skeleton width={50} height={20} className="mb-1"/>
                                                                    <Skeleton width={70} height={14}/>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    {/* Блок пересадки */}
                                                    <div className="rounded-[10px] mb-2.5 p-1.5">
                                                        <table className="w-full">
                                                            <tbody>
                                                            <tr className="flex">
                                                                <td className="w-[40%] p-2.5">
                                                                    <Skeleton width={`80%`} height={20}/>
                                                                </td>
                                                                <td className="w-[15%] p-2.5 text-center">
                                                                    <Skeleton width={60} height={16}/>
                                                                </td>
                                                                <td className="w-[45%] p-2.5">
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <div
                                                        className="bg-[#e4e4e4] shadow-inner p-2.5 rounded-[10px] mb-2.5">
                                                        <table className="w-full">
                                                            <tbody>
                                                            <tr className="flex">
                                                                <td className="w-[30%] p-2.5 align-top">
                                                                    <Skeleton width={`70%`} height={20}
                                                                              className="mb-2"/>
                                                                    <Skeleton width={`90%`} height={14}
                                                                              className="mb-1"/>
                                                                    <Skeleton width={`80%`} height={14}/>
                                                                </td>
                                                                <td className="w-[20%] p-2.5 align-top">
                                                                    <Skeleton width={60} height={14} className="mb-1"/>
                                                                    <Skeleton width={50} height={20} className="mb-1"/>
                                                                    <Skeleton width={70} height={14}/>
                                                                </td>
                                                                <td className="w-[30%] p-2.5 text-center">
                                                                    <Skeleton width={80} height={16}/>
                                                                </td>
                                                                <td className="w-[20%] p-2.5 align-top">
                                                                    <Skeleton width={60} height={14} className="mb-1"/>
                                                                    <Skeleton width={50} height={20} className="mb-1"/>
                                                                    <Skeleton width={70} height={14}/>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            ))}
                                        </>)
                                    } else if (networkError) {
                                        return (
                                            <div className="relative flex justify-center py-10">
                                                <div
                                                    className="bg-white rounded-[20px] w-[600px] h-[300px] shadow-[10px_10px_10px_#d4d4d4]">
                                                    <div className="p-10 flex justify-center">
                                                        <svg width="100px" height="100px" viewBox="0 0 36 36"
                                                             xmlns="http://www.w3.org/2000/svg"
                                                             aria-hidden="true" role="img"
                                                             className="iconify iconify--twemoji"
                                                             preserveAspectRatio="xMidYMid meet">
                                                            <path fill="#FFCC4D"
                                                                  d="M36 18c0 9.941-8.059 18-18 18c-9.94 0-18-8.059-18-18C0 8.06 8.06 0 18 0c9.941 0 18 8.06 18 18"></path>
                                                            <ellipse fill="#664500" cx="11.5" cy="17" rx="2.5"
                                                                     ry="3.5"></ellipse>
                                                            <ellipse fill="#664500" cx="24.5" cy="17" rx="2.5"
                                                                     ry="3.5"></ellipse>
                                                            <path fill="#664500"
                                                                  d="M5.999 13.5a1 1 0 0 1-.799-1.6c3.262-4.35 7.616-4.4 7.8-4.4a1 1 0 0 1 .004 2c-.155.002-3.568.086-6.204 3.6a.998.998 0 0 1-.801.4zm24.002 0a.998.998 0 0 1-.801-.4c-2.641-3.521-6.061-3.599-6.206-3.6a1.002 1.002 0 0 1-.991-1.005A.997.997 0 0 1 23 7.5c.184 0 4.537.05 7.8 4.4a1 1 0 0 1-.799 1.6zm-6.516 14.879C23.474 28.335 22.34 24 18 24s-5.474 4.335-5.485 4.379a.496.496 0 0 0 .232.544a.51.51 0 0 0 .596-.06C13.352 28.855 14.356 28 18 28c3.59 0 4.617.83 4.656.863a.5.5 0 0 0 .829-.484z"></path>
                                                            <path fill="#5DADEC"
                                                                  d="M16 31c0 2.762-2.238 5-5 5s-5-2.238-5-5s4-10 5-10s5 7.238 5 10z"></path>
                                                        </svg>
                                                    </div>
                                                    <div className="text-2xl font-bold text-center">Что-то пошло не
                                                        так
                                                    </div>
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
                                                             aria-hidden="true" role="img"
                                                             className="iconify iconify--twemoji"
                                                             preserveAspectRatio="xMidYMid meet">
                                                            <circle fill="#FFCB4C" cx="18" cy="17.018" r="17"></circle>
                                                            <path fill="#65471B"
                                                                  d="M14.524 21.036a.914.914 0 0 1-.312-.464a.799.799 0 0 1 .59-1.021c4.528-1.021 7.577 1.363 7.706 1.465c.384.306.459.845.173 1.205c-.286.358-.828.401-1.211.097c-.11-.084-2.523-1.923-6.182-1.098a.91.91 0 0 1-.764-.184z"></path>
                                                            <ellipse fill="#65471B" cx="13.119" cy="11.174" rx="2.125"
                                                                     ry="2.656"></ellipse>
                                                            <ellipse fill="#65471B" cx="24.375" cy="12.236" rx="2.125"
                                                                     ry="2.656"></ellipse>
                                                            <path fill="#F19020"
                                                                  d="M17.276 35.149s1.265-.411 1.429-1.352c.173-.972-.624-1.167-.624-1.167s1.041-.208 1.172-1.376c.123-1.101-.861-1.363-.861-1.363s.97-.4 1.016-1.539c.038-.959-.995-1.428-.995-1.428s5.038-1.221 5.556-1.341c.516-.12 1.32-.615 1.069-1.694c-.249-1.08-1.204-1.118-1.697-1.003c-.494.115-6.744 1.566-8.9 2.068l-1.439.334c-.54.127-.785-.11-.404-.512c.508-.536.833-1.129.946-2.113c.119-1.035-.232-2.313-.433-2.809c-.374-.921-1.005-1.649-1.734-1.899c-1.137-.39-1.945.321-1.542 1.561c.604 1.854.208 3.375-.833 4.293c-2.449 2.157-3.588 3.695-2.83 6.973c.828 3.575 4.377 5.876 7.952 5.048l3.152-.681z"></path>
                                                            <path fill="#65471B"
                                                                  d="M9.296 6.351a.925.925 0 0 1-.391-.399a.8.8 0 0 1 .393-1.112c4.266-1.831 7.699-.043 7.843.034c.433.231.608.747.391 1.154c-.216.405-.74.546-1.173.318c-.123-.063-2.832-1.432-6.278.047a.915.915 0 0 1-.785-.042zm12.135 3.75a.924.924 0 0 1-.362-.424a.8.8 0 0 1 .468-1.084c4.381-1.536 7.685.48 7.823.567c.415.26.555.787.312 1.178c-.242.39-.776.495-1.191.238c-.12-.072-2.727-1.621-6.267-.379a.924.924 0 0 1-.783-.096z"></path>
                                                        </svg>
                                                    </div>
                                                    <div className="text-2xl font-bold text-center">Ничего не нашлось
                                                    </div>
                                                    <div className="text-xl text-center">
                                                        Похоже вы еще не сохраняли маршруты
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                })()}
                            </>
                        )}
                        {
                            !logged && (
                                <div
                                    className="bg-white rounded-[20px] mb-8 p-2.5 shadow-[10px_10px_10px_#d4d4d4] align-middle">
                                    <div className="text-center p-10">
                                        <div className="flex justify-center mb-2">
                                            <svg width="80px" height="80px"
                                                 viewBox="0 0 24 24" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd"
                                                      d="M5.07692 5.92648C5.07692 4.38908 6.33971 3.14278 7.89744 3.14278H12C12.4248 3.14278 12.7692 3.48268 12.7692 3.90197C12.7692 4.32126 12.4248 4.66116 12 4.66116H7.89744C7.18938 4.66116 6.61539 5.22766 6.61539 5.92648V6.93873C6.61539 7.35802 6.27099 7.69792 5.84615 7.69792C5.42132 7.69792 5.07692 7.35802 5.07692 6.93873V5.92648ZM5.84615 16.3021C6.27099 16.3021 6.61539 16.642 6.61539 17.0613V18.0735C6.61539 18.7723 7.18938 19.3388 7.89744 19.3388H12C12.4248 19.3388 12.7692 19.6788 12.7692 20.098C12.7692 20.5173 12.4248 20.8572 12 20.8572H7.89744C6.33971 20.8572 5.07692 19.6109 5.07692 18.0735V17.0613C5.07692 16.642 5.42132 16.3021 5.84615 16.3021Z"
                                                      fill="#030D45"/>
                                                <path fillRule="evenodd" clipRule="evenodd"
                                                      d="M12.7692 4.78618C12.7692 3.90491 13.6592 3.29355 14.4966 3.59962L19.6248 5.47416C20.1277 5.658 20.4615 6.13139 20.4615 6.66071V17.3393C20.4615 17.8686 20.1277 18.342 19.6248 18.5258L14.4966 20.4004C13.6592 20.7065 12.7692 20.0951 12.7692 19.2138V4.78618ZM15.0309 2.17576C13.1887 1.5024 11.2308 2.84738 11.2308 4.78618V19.2138C11.2308 21.1526 13.1887 22.4976 15.0309 21.8242L20.1591 19.9497C21.2656 19.5452 22 18.5038 22 17.3393V6.66071C22 5.4962 21.2656 4.45475 20.1591 4.0503L15.0309 2.17576Z"
                                                      fill="#030D45"/>
                                                <path fillRule="evenodd" clipRule="evenodd"
                                                      d="M6.32787 9.43867C6.62827 9.14218 7.11532 9.14218 7.41572 9.43867L9.46701 11.4632C9.76741 11.7597 9.76741 12.2403 9.46701 12.5368L7.41572 14.5613C7.11532 14.8578 6.62827 14.8578 6.32787 14.5613C6.02746 14.2649 6.02746 13.7842 6.32787 13.4877L7.06599 12.7592H2.76923C2.3444 12.7592 2 12.4193 2 12C2 11.5807 2.3444 11.2408 2.76923 11.2408H7.06599L6.32787 10.5123C6.02746 10.2158 6.02746 9.73515 6.32787 9.43867Z"
                                                      fill="#030D45"/>
                                            </svg>
                                        </div>
                                        <div className="font-bold text-[18px]">Войдите, чтобы получить доступ к
                                            сохраненным
                                            маршрутам
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
        ;
}

export default Profile;