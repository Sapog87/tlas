import MoreButton from './MoreButton';
import './Result.css'
import React, { useState } from 'react';
import Result from './Result';

function ResultArea({ data, handleMoreButton }) {
  return (
    <div className='ResultArea'>
      {data.map((item) => (
        <Result header={item.header} route={item.route} />
      ))}
      <MoreButton handleMoreButton={handleMoreButton} />
    </div>
  );
}

export default ResultArea;
