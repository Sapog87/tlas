import React from 'react';

const Carrier = ({
                     selectedCarrier,
                     handleSelectedCarrierCheckboxChange
                 }) => {
    return (
        <div className="p-2">
            <div className="p-1">
                {Object.keys(selectedCarrier).sort((a, b) => a.length - b.length).map((key) => (
                    <div>
                        <label className="flex items-start" key={key}>
                            <input
                                className="accent-[#96dbfa] mr-2 mt-[5px]"
                                type="checkbox"
                                name={key}
                                checked={!!selectedCarrier[key]}
                                onChange={handleSelectedCarrierCheckboxChange}
                            />
                            {(() => {
                                return (
                                    <div className="select-none">{key}</div>
                                )
                            })()}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Carrier;