import React from 'react';

const TransferAmountSelector = ({
                                    selectedTransfers,
                                    handleSelectedTransfersCheckboxChange
                                }) => {
    return (
        <div className="p-2">
            <div className="p-1">
                {Object.keys(selectedTransfers).map((key) => (
                    <div>
                        <label className="flex" key={key}>
                            <input
                                className="accent-[#96dbfa] mr-2"
                                type="checkbox"
                                name={key}
                                checked={!!selectedTransfers[key]}
                                onChange={handleSelectedTransfersCheckboxChange}
                            />
                            {(() => {
                                let name;
                                switch (key) {
                                    case "0":
                                        name = "Прямые рейсы";
                                        break;
                                    case "1":
                                        name = "1 пересадка";
                                        break;
                                    case "2":
                                    case "3":
                                    case "4":
                                        name = `${key} пересадки`;
                                        break;
                                    case "5":
                                    case "6":
                                    case "7":
                                    case "8":
                                    case "9":
                                        name = `${key} пересадок`;
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

export default TransferAmountSelector;