import './Result.css'
import React from 'react';
import { formatDate, calculateTimeDifference } from '../../Utils';

function Route({ info }) {
    return (
        <div className='Route'>
            <table>
                <tr>
                    <td>
                        <div>
                            {info.transport}
                        </div>
                        <span />
                        <div>
                            {info.fromCity} → {info.toCity}
                        </div>
                    </td>
                    <td>
                        <div>
                            <div>{formatDate(info.startDate)}</div>
                            <span />
                            <div>{info.fromStation}</div>
                        </div>
                        <span />
                        <div>
                            {info.from}
                        </div>
                    </td>
                    <td>
                        <div>
                            {calculateTimeDifference(info.startDate, info.endDate)}
                        </div>
                    </td>
                    <td>
                        <div>
                            <div>{formatDate(info.endDate)}</div>
                            <span />
                            <div>{info.toStation}</div>
                        </div>
                        <span />
                        <div>
                            {info.to}
                        </div>
                    </td>
                    <td></td>
                </tr>
            </table>
        </div>
    );
}

export default Route;