import React from 'react';
import Slider from "rc-slider";

function Time({
                  departureTimeRange,
                  arrivalTimeRange,
                  handleDepartureTimeRangeSliderChange,
                  handleArrivalTimeRangeSliderChange
              }) {
    return (
        <div>
            <div className="p-2">
                <div className="mb-2 flex justify-between">
                    <div>Отправление:</div>
                    <div>{departureTimeRange[0]}ч - {departureTimeRange[1]}ч</div>
                </div>
                <Slider
                    range
                    min={0}
                    max={24}
                    step={1}
                    value={departureTimeRange}
                    onChange={handleDepartureTimeRangeSliderChange}
                    marks={{}}
                    allowCross={false}
                />
            </div>
            <hr/>
            <div className="p-2">
                <div className="mb-2 flex justify-between">
                    <div>Прибытие:</div>
                    <div>{arrivalTimeRange[0]}ч - {arrivalTimeRange[1]}ч</div>
                </div>
                <Slider
                    range
                    min={0}
                    max={24}
                    step={1}
                    value={arrivalTimeRange}
                    onChange={handleArrivalTimeRangeSliderChange}
                    marks={{}}
                    allowCross={false}
                />
            </div>
        </div>
    );
}

export default Time;