import React, { useState, useEffect } from 'react';
import './Criteria.css'

const TransportSelector = ({ criteria }) => {
    const [selectedTransports, setSelectedTransports] = useState({});

    useEffect(() => {
        const initialState = criteria.reduce((acc, value) => {
            acc[value] = selectedTransports[value] ?? true;
            return acc;
        }, {});
        setSelectedTransports(initialState);
    }, [criteria]);

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;

        if (!checked && Object.values(selectedTransports).filter(Boolean).length === 1) {
            return;
        }

        setSelectedTransports((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    };

    return (
        <div>
            {Object.keys(selectedTransports).map((key) => (
                <div>
                    <label key={key}>
                        <input
                            className="TransportCheckBox"
                            type="checkbox"
                            name={key}
                            checked={!!selectedTransports[key]}
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

export default TransportSelector;