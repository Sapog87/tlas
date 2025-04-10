import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function JourneyTime({
                         minJourneyTimeRange,
                         maxJourneyTimeRange,
                         journeyTimeRange,
                         handleJourneyTimeRangeSliderChange
                     }) {
    return (
        <div className="p-2 ">
            <div className="mb-2 flex justify-between">
                <div>{journeyTimeRange[0]}ч</div>
                <div>{journeyTimeRange[1]}ч</div>
            </div>
            <Slider
                range
                min={minJourneyTimeRange}
                max={maxJourneyTimeRange}
                step={1}
                value={journeyTimeRange}
                onChange={handleJourneyTimeRangeSliderChange}
                marks={{}}
                allowCross={false}
            />
        </div>
    );
}

export default JourneyTime;
