import React from 'react';
import {calculateTimeDifferenceFormated, formatDate, formatDateWithoutOffset, getCarType} from '../../Utils';
import TrainIcon from "../Icon/TrainIcon";
import PlaneIcon from "../Icon/PlaneIcon";
import SuburbanIcon from "../Icon/SuburbanIcon";

function Route({
                   transport,
                   raceNumber,
                   carrier,
                   startDateTime,
                   finishDateTime,
                   startStation,
                   finishStation,
                   startCity,
                   finishCity,
                   products,
                   vehicle,
                   setShowModal,
                   setRequest,
                   setTrainData,
                   originCode,
                   destinationCode,
               }) {
    return (
        <div
            className={`bg-[#e4e4e4] shadow-inner p-2.5 rounded-[10px] mb-2.5 ${products && products.length > 0 ? 'cursor-pointer' : ''}`}
            onClick={() => {
                if (transport === "TRAIN") {
                    setShowModal(true)
                    setRequest({
                        "origin": originCode,
                        "destination": destinationCode,
                        "date": startDateTime,
                        "train": raceNumber
                    });
                    setTrainData({
                        raceNumber,
                        carrier,
                        startDateTime,
                        finishDateTime,
                        startStation,
                        finishStation,
                        startCity,
                        finishCity,
                        vehicle
                    });
                }
            }}
        >
            <table className="w-full">
                <tbody>
                <tr className="flex">
                    <td className="w-[30%] p-2.5 align-middle">
                        {(() => {
                            if (transport === "TRAIN") {
                                return (
                                    <div className="flex">
                                        <TrainIcon/> {raceNumber}
                                    </div>
                                )
                            } else if (transport === "PLANE") {
                                return (
                                    <div className="flex">
                                        <PlaneIcon/> {raceNumber}
                                    </div>
                                )
                            } else if (transport === "SUBURBAN") {
                                return (
                                    <div className="flex">
                                        <SuburbanIcon/> {raceNumber}
                                    </div>
                                )
                            }
                        })()}
                        <span/>
                        <div className="text-[14px]">
                            {startCity} — {finishCity}
                        </div>
                        <div className="text-[14px] text-[#555555]">
                            <span>{carrier}</span> {vehicle && <span className="text-orange-800">«{vehicle}»</span>}
                        </div>
                    </td>
                    <td className="w-[35%] p-2.5 align-top">
                        <div>
                            <div className="flex justify-between">
                                <div className="text-left">
                                    {(() => {
                                        const dt = formatDateWithoutOffset(startDateTime).split(' ')
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
                                    {calculateTimeDifferenceFormated(startDateTime, finishDateTime)}
                                </div>
                                <div className="text-right">
                                    {(() => {
                                        const dt = formatDateWithoutOffset(finishDateTime).split(' ')
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
                                    {startStation}
                                </div>
                                <div className="text-xs text-right">
                                    {finishStation}
                                </div>
                            </div>
                        </div>
                    </td>
                    <td className="w-[35%] p-2.5 align-top">
                        {products.map((item) => {
                            const type = getCarType(item.carType);
                            const result = type && (
                                <div className="bg-[#d4d4d4] flex justify-between shadow-inner m-1 p-1 rounded-[5px]">
                                    <div className="text-[13px]">
                                        {type}: {item.freePlaces}
                                    </div>
                                    <div className="text-[14px] font-bold">
                                        от {item.priceInKopecks / 100}₽
                                    </div>
                                </div>
                            )

                            return (
                                <div>
                                    {result}
                                </div>
                            )
                        })}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Route;