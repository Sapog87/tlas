import React from 'react';

const Carrier = ({
                               selectedCarrier,
                               handleSelectedCarrierCheckboxChange
                           }) => {
    return (
        <div className="p-2">
            <div className="p-1">
                {Object.keys(selectedCarrier).map((key) => (
                    <div>
                        <label className="flex" key={key}>
                            <input
                                className="accent-[#96dbfa] mr-2"
                                type="checkbox"
                                name={key}
                                checked={!!selectedCarrier[key]}
                                onChange={handleSelectedCarrierCheckboxChange}
                            />
                            {(() => {
                                let name;
                                switch (key) {
                                    case "TRAIN":
                                        name = "Поезд";
                                        break;
                                    case "PLANE":
                                        name = "Самолет";
                                        break;
                                    case "SUBURBAN":
                                        name = "Пригородный поезд";
                                        break;
                                    default:
                                        name = key;
                                        break;
                                }

                                return (
                                    <div className="select-none">{name}</div>
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