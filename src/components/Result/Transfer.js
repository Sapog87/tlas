import React from 'react';
import {calculateTimeDifferenceFormated} from '../../Utils';

function Transfer({
                      startStation,
                      finishStation,
                      startDateTime,
                      finishDateTime
                  }) {
    return (
        <div className="rounded-[10px] mb-2.5 p-1.5">
            <table className="w-full">
                <tbody>
                <tr className="flex">
                    <td className="w-[40%] p-2.5">
                        <div className="break-words text-[#a5a5a5] text-[14px]">
                            <div className="text-[16px] flex align-middle">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 10L12 15L17 10" stroke="gray" strokeWidth="2" strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                    <path d="M7 5L12 10L17 5" stroke="gray" strokeWidth="2" strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                </svg>
                                Пересадка
                            </div>
                            <span>
                                {(() => {
                                    if (startStation === finishStation) {
                                        return (
                                            <span className="text-[14px] font-bold">
                                                {startStation}
                                            </span>
                                        )
                                    } else {
                                        return (
                                            <span className="text-[14px]">
                                                <span className="font-bold">{startStation}</span>
                                                <span> → </span>
                                                <span className="font-bold">{finishStation}</span>
                                            </span>
                                        )
                                    }
                                })()}
                            </span>
                        </div>
                    </td>
                    <td className="w-[15%] p-2.5">
                        <div className="text-[#a5a5a5] text-center">
                            {calculateTimeDifferenceFormated(startDateTime, finishDateTime)}
                        </div>
                    </td>
                    <td className="w-[45%] p-2.5"></td>
                </tr>
                </tbody>
            </table>
        </div>
    )
        ;
}

export default Transfer;