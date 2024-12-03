import './Criteria.css'
import React from 'react';
import TransferTimeRangeSlider from './TransferTimeRangeSlider';
import TransportSelector from './TransportSelector';
import TransferAmountSelector from './TransferAmountSelector';
import JourneyTime from './JourneyTime';

function Criteria({ criteria, handleCriteriaChange }) {
  console.log(criteria)
  return (
    <div className='CriteriaArea'>
      <div className='Criteria'>
        <h4>Пересадки</h4>
        <hr className='Line'></hr>
        <TransferAmountSelector criteria={criteria.transfersAmount} />
        <TransferTimeRangeSlider criteria={criteria.transfersTimeRange} />
      </div>
      <div className='Criteria'>
        <h4>Транспорт</h4>
        <hr className='Line'></hr>
        <TransportSelector criteria={criteria.transportType} />
      </div>
      <div className='Criteria'>
        <h4>Время в пути</h4>
        <hr className='Line'></hr>
        <JourneyTime criteria={criteria.journeyTimeRange} />
      </div>
    </div>
  );
}

export default Criteria;
