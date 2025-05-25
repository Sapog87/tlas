import React from 'react';
import {calculateTimeDifferenceFormated, formatDateWithoutOffset} from '../../Utils';
import TrainIcon from "../Icon/TrainIcon";
import PlaneIcon from "../Icon/PlaneIcon";
import SuburbanIcon from "../Icon/SuburbanIcon";
import BusIcon from "../Icon/BusIcon";

function RouteNoProducts({
                             transport,
                             raceNumber,
                             carrier,
                             startDateTime,
                             finishDateTime,
                             startStation,
                             finishStation,
                             startCity,
                             finishCity,
                             vehicle,
                         }) {
    return (
        <div
            className={`bg-[#e4e4e4] shadow-inner p-2.5 rounded-[10px] mb-2.5`}
        >
            <table className="w-full">
                <tbody>
                <tr className="flex">
                    <td className="w-[40%] p-2.5 align-middle">
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
                            } else if (transport === "BUS") {
                                return (
                                    <div className="flex">
                                        <BusIcon/> {raceNumber}
                                    </div>
                                )
                            }
                        })()}
                        <span/>
                        <div className="text-[14px]">
                            {startCity} — {finishCity}
                        </div>
                        <div className="text-[14px] text-[#555555]">
                            <span>{carrier}</span> {vehicle && <span className="text-orange-800">{vehicle}</span>}
                        </div>
                    </td>
                    <td className="w-[60%] p-2.5 align-top">
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
                </tr>
                </tbody>
            </table>
        </div>
    );
}

export default RouteNoProducts;