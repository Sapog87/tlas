import React from 'react';
import Slider from "rc-slider";

function Price({
                   minPrice,
                   maxPrice,
                   priceRange,
                   handlePriceRangeSliderChange
               }) {
    return (
        <div className="p-2 ">
            <div className="mb-2 flex justify-between">
                <div>{priceRange[0]}₽</div>
                <div>{priceRange[1]}₽</div>
            </div>
            <Slider
                range
                min={minPrice}
                max={maxPrice}
                step={1}
                value={priceRange}
                onChange={handlePriceRangeSliderChange}
                marks={{}}
                allowCross={false}
            />
        </div>
    );
}

export default Price;