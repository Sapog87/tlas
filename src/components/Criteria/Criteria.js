import React from 'react';
import TransferTimeRangeSlider from './TransferTimeRangeSlider';
import TransferAmountSelector from './TransferAmountSelector';
import JourneyTime from './JourneyTime';
import Price from "./Price";
import TransportSelector from "./TransportSelector";
import Time from "./Time";

function Criteria({
                      minTransferTimeRange,
                      maxTransferTimeRange,
                      transferTimeRange,
                      handleTransferTimeRangeSliderChange,
                      minJourneyTimeRange,
                      maxJourneyTimeRange,
                      journeyTimeRange,
                      handleJourneyTimeRangeSliderChange,
                      selectedTransfers,
                      handleSelectedTransfersCheckboxChange,
                      minPrice,
                      maxPrice,
                      priceRange,
                      handlePriceRangeSliderChange,
                      selectedTransport,
                      handleSelectedTransportCheckboxChange,
                      departureTimeRange,
                      handleDepartureRangeSliderChange,
                      arrivalTimeRange,
                      handleArrivalRangeSliderChange
                  }) {
    return (
        <div className="w-[20%] max-w-[300px] min-w-[250px]">
            {transferTimeRange &&
                <div className="bg-white rounded-[20px] mb-4 px-4 pt-[5px] pb-[15px] shadow-[5px_5px_5px_#d4d4d4]">
                    <h4 className="p-2">Пересадки</h4>
                    <hr className="text-[#f0f0f0]"></hr>
                    <TransferAmountSelector
                        selectedTransfers={selectedTransfers}
                        handleSelectedTransfersCheckboxChange={handleSelectedTransfersCheckboxChange}
                    />
                    <hr className="text-[#f0f0f0]"></hr>
                    <TransferTimeRangeSlider
                        minTransferTimeRange={minTransferTimeRange}
                        maxTransferTimeRange={maxTransferTimeRange}
                        transferTimeRange={transferTimeRange}
                        handleTransferTimeRangeSliderChange={handleTransferTimeRangeSliderChange}
                    />
                </div>
            }

            {selectedTransport &&
                <div className="bg-white rounded-[20px] mb-4 px-4 pt-[5px] pb-[15px] shadow-[5px_5px_5px_#d4d4d4]">
                    <h4 className="p-2">Транспорт</h4>
                    <hr className="text-[#f0f0f0]"></hr>
                    <TransportSelector
                        selectedTransport={selectedTransport}
                        handleSelectedTransportCheckboxChange={handleSelectedTransportCheckboxChange}
                    />
                </div>
            }

            {journeyTimeRange &&
                <div className="bg-white rounded-[20px] mb-4 px-4 pt-[5px] pb-[15px] shadow-[5px_5px_5px_#d4d4d4]">
                    <h4 className="p-2">Время в пути</h4>
                    <hr className="text-[#f0f0f0]"></hr>
                    <JourneyTime
                        minJourneyTimeRange={minJourneyTimeRange}
                        maxJourneyTimeRange={maxJourneyTimeRange}
                        journeyTimeRange={journeyTimeRange}
                        handleJourneyTimeRangeSliderChange={handleJourneyTimeRangeSliderChange}
                    />
                </div>
            }

            {priceRange &&
                <div className="bg-white rounded-[20px] mb-4 px-4 pt-[5px] pb-[15px] shadow-[5px_5px_5px_#d4d4d4]">
                    <h4 className="p-2">Стоимость</h4>
                    <hr className="text-[#f0f0f0]"></hr>
                    <Price
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        priceRange={priceRange}
                        handlePriceRangeSliderChange={handlePriceRangeSliderChange}
                    />
                </div>
            }

            {
                <div className="bg-white rounded-[20px] mb-4 px-4 pt-[5px] pb-[15px] shadow-[5px_5px_5px_#d4d4d4]">
                    <h4 className="p-2">Время</h4>
                    <hr className="text-[#f0f0f0]"></hr>
                    <Time
                        departureTimeRange={departureTimeRange}
                        handleDepartureTimeRangeSliderChange={handleDepartureRangeSliderChange}
                        arrivalTimeRange={arrivalTimeRange}
                        handleArrivalTimeRangeSliderChange={handleArrivalRangeSliderChange}
                    />
                </div>
            }
        </div>
    );
}

export default Criteria;
