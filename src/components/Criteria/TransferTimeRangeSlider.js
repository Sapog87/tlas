import React, { useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './Criteria.css'

const TransferTimeRangeSlider = ({ criteria }) => {
  const [timeRange, setTimeRange] = useState(criteria);

  const handleSliderChange = (value) => {
    if (value[0] !== value[1]) {
      setTimeRange(value);
    }
  };

  return (
    <div className='TransferTimeRangeSlider'>
      <p>Длительность пересадок: {timeRange[0]}ч - {timeRange[1]}ч</p>
      <Slider
        range
        min={criteria[0]}
        max={criteria[1]}
        step={1}
        value={timeRange}
        onChange={handleSliderChange}
        marks={{
        }}
        allowCross={false}
      />
    </div>
  );
};

export default TransferTimeRangeSlider;