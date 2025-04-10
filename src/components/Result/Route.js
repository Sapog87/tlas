import React from 'react';
import {calculateTimeDifferenceFormated, formatDate} from '../../Utils';
import TrainIcon from "../Icon/TrainIcon";
import PlaneIcon from "../Icon/PlaneIcon";

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
                   products
               }) {
    return (
        <div className="bg-[#e4e4e4] shadow-inner p-2.5 rounded-[10px] mb-2.5">
            <table className="w-full">
                <tbody>
                <tr className="flex">
                    <td className="w-[30%] p-2.5 align-top">
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
                            }
                        })()}
                        <span/>
                        <div className="text-[14px]">
                            {startCity} — {finishCity}
                        </div>
                        <div className="text-[14px] text-[#555555]">
                            {carrier}
                        </div>
                    </td>
                    <td className="w-[10%] p-2.5 align-top">
                        <div>
                            <div>
                                {(() => {
                                    const dt = formatDate(startDateTime).split(' ')
                                    return (
                                        <div>
                                            <div className="text-xs">{dt[0]} {dt[1]}</div>
                                            <div className="font-bold">{dt[2]}</div>
                                        </div>
                                    )
                                })()}
                            </div>
                            <span/>
                            <div className="text-xs">
                                {startStation}
                            </div>
                        </div>
                    </td>
                    <td className="w-[15%] p-2.5">
                        <div className="text-[#888888] text-center">
                            {calculateTimeDifferenceFormated(startDateTime, finishDateTime)}
                        </div>
                    </td>
                    <td className="w-[10%] p-2.5 align-top">
                        <div>
                            <div>
                                {(() => {
                                    const dt = formatDate(finishDateTime).split(' ')
                                    return (
                                        <div>
                                            <div className="text-xs">{dt[0]} {dt[1]}</div>
                                            <div className="font-bold">{dt[2]}</div>
                                        </div>
                                    )
                                })()}
                            </div>
                            <span/>
                            <div className="text-xs">
                                {finishStation}
                            </div>
                        </div>
                    </td>
                    <td className="w-[35%] p-2.5 align-top">
                        {products.map((item) => {
                            let type;
                            switch (item.type) {
                                case "COMPARTMENT":
                                    type = "купе";
                                    break;
                                case "RESERVED_SEAT":
                                    type = "плацкарт";
                                    break;
                                case "LUXURY":
                                    type = "СВ";
                                    break;
                                case "SOFT":
                                    type = "люкс";
                                    break;
                                case "SEDENTARY":
                                    type = "сидячие";
                                    break;
                                default:
                                    break;
                            }

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
    )
        ;
}

export default Route;