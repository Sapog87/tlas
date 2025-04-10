import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const TransferTimeRangeSlider = ({
                                     minTransferTimeRange,
                                     maxTransferTimeRange,
                                     transferTimeRange,
                                     handleTransferTimeRangeSliderChange
                                 }) => {
    return (
        <div className="p-2">
            <div className="mb-2 flex justify-between">
                <div>{transferTimeRange[0]}ч</div>
                <div>{transferTimeRange[1]}ч</div>
            </div>
            <Slider
                range
                min={minTransferTimeRange}
                max={maxTransferTimeRange}
                step={1}
                value={transferTimeRange}
                onChange={handleTransferTimeRangeSliderChange}
                marks={{}}
                allowCross={false}
            />
        </div>
    );
};

export default TransferTimeRangeSlider;