import './Result.css'
import Route from './Route';
import Transfer from './Transfer';
import { formatDate, calculateTimeDifference } from '../../Utils';

export default function Result({ header, route }) {
    return (
        <div className="Result">
            <div className='ResultHeader'>
                <table>
                    <tr>
                        <td></td>
                        <td>
                            <div>
                                <div>{formatDate(header.startDate)}</div>
                            </div>
                            <span />
                            <div>
                                {/* {info.from} */}
                            </div>
                        </td>
                        <td>
                            <div>
                                {calculateTimeDifference(header.startDate, header.endDate)}
                            </div>
                        </td>
                        <td>
                            <div>
                                <div>{formatDate(header.endDate)}</div>
                            </div>
                            <span />
                            <div>
                                {/* {info.to} */}
                            </div>
                        </td>
                        <td></td>
                    </tr>
                </table>
            </div>
            <hr className='Line'></hr>
            <div className='ResultRoute'>
                {route.map((info) => (
                    <div>
                        {(() => {
                            if (info.type == "way") {
                                return (
                                    <Route info={info} />
                                )
                            } else if (info.type == "transfer") {
                                return (
                                    <Transfer info={info} />
                                )
                            }
                        })()}
                    </div>
                ))}
            </div>
        </div>
    );
}