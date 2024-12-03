import React, { useState, useEffect } from 'react';
import './Criteria.css'

const TransferAmountSelector = ({ criteria }) => {
  const [selectedTransfers, setSelectedTrnsfers] = useState({});

  useEffect(() => {
    const initialState = criteria.reduce((acc, value) => {
      acc[value] = selectedTransfers[value] ?? false;
      return acc;
    }, {});
    setSelectedTrnsfers(initialState);
  }, [criteria]);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    setSelectedTrnsfers({
      ...selectedTransfers,
      [name]: checked,
    });
  };

  return (
    <div>
      <p>Количество пересадок</p>
      {Object.keys(selectedTransfers).map((key) => (
        <div>
          <label key={key}>
            <input
              className="TransportCheckBox"
              type="checkbox"
              name={key}
              checked={!!selectedTransfers[key]}
              onChange={handleCheckboxChange}
            />
            {key}
          </label>
          <br />
        </div>
      ))}
    </div>
  );
};

export default TransferAmountSelector;