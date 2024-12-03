import './Search.css'
import React, { useState } from 'react';

function Search({ handleSearchSubmit }) {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState({});

  const handleSearch = () => {
    const today = new Date().toISOString().split('T')[0];
    const newErrors = {};

    if (!departure) newErrors.departure = true;
    if (!arrival) newErrors.arrival = true;
    if (!date) newErrors.date = true;
    if (date && date < today) newErrors.date = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    handleSearchSubmit({ departure, arrival, date })
  };

  const clearError = (field) => {
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[field];
      return updatedErrors;
    });
  };

  return (
    <div className="Search">
      <div className="Form-group">
        <input
          className={`Departure-input ${errors.departure ? 'Error' : ''}`}
          type="text"
          value={departure}
          placeholder='Откуда'
          onChange={(e) => { setDeparture(e.target.value); clearError('departure'); }}
        />
      </div>
      <div className="Form-group">
        <input
          className={`Arrival-input ${errors.arrival ? 'Error' : ''}`}
          type="text"
          value={arrival}
          placeholder='Куда'
          onChange={(e) => { setArrival(e.target.value); clearError('arrival'); }}
        />
      </div>
      <div className="Form-group">
        <input
          className={`Date-input ${errors.date ? 'Error' : ''}`}
          type="text"
          value={date}
          onFocus={(e) => e.target.type = 'date'}
          onBlur={(e) => e.target.type = date ? 'date' : 'text'}
          placeholder="Когда"
          onChange={(e) => { setDate(e.target.value); clearError('date'); }}
        />
      </div>
      <button onClick={handleSearch}>Найти</button>
    </div>
  );
}

export default Search;
