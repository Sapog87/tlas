import './Result.css'
import React from 'react';
import { calculateTimeDifference } from '../../Utils';

function Transfer({ info }) {
    return (
        <div className='Transfer'>
            <table>
                <tr>
                    <td>
                        <div>
                            <span>Пересадка в </span>
                            {(() => {
                                if (info.fromCity === info.toCity) {
                                    return (
                                        <span>
                                            <span>{info.fromCity} </span>
                                            {(() => {
                                                if (info.fromStation === info.toStation) {
                                                    return (
                                                        <span>
                                                            ({info.fromStation})
                                                        </span>
                                                    )
                                                } else {
                                                    return (
                                                        <span>
                                                            ({info.fromStation} → {info.toStation})
                                                        </span>
                                                    )
                                                }
                                            })()}
                                        </span>
                                    )
                                } else {
                                    return (
                                        <span>
                                            {info.fromCity} → {info.toCity} ({info.fromStation} → {info.toStation})
                                        </span>
                                    )
                                }
                            })()}
                        </div>
                    </td>
                    <td></td>
                    <td>
                        <div>
                            {calculateTimeDifference(info.startDate, info.endDate)}
                        </div>
                    </td>
                    <td></td>
                    <td></td>
                </tr>
            </table>
        </div>
    );
}

export default Transfer;