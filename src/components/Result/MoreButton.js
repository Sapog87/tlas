import './Result.css'
import React from 'react';

function MoreButton({ handleMoreButton }) {

    return (
        <div className='MoreButton' onClick={handleMoreButton}>
            <p>Далее</p>
        </div>
    );
}

export default MoreButton;
