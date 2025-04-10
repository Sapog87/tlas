import React from 'react';

const TransportSelector = ({
                               selectedTransport,
                               handleSelectedTransportCheckboxChange
                           }) => {
    return (
        <div className="p-2">
            <div className="p-1">
                {Object.keys(selectedTransport).map((key) => (
                    <div>
                        <label className="flex" key={key}>
                            <input
                                className="accent-[#96dbfa] mr-2"
                                type="checkbox"
                                name={key}
                                checked={!!selectedTransport[key]}
                                onChange={handleSelectedTransportCheckboxChange}
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
                                    default:
                                        name = key;
                                        break;
                                }

                                return (
                                    <div>{name}</div>
                                )
                            })()}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransportSelector;