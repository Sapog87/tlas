import React from "react";

const TrainIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.size || 24}
        height={props.size || 24}
        viewBox="0 0 24 24"
        fill="red"
        {...props}
    >
        <path d="M12 2C8.13 2 5 3.79 5 6v9c0 1.66 1.34 3 3 3l-2 2v1h2.5l2-2h3l2 2H18v-1l-2-2c1.66 0 3-1.34 3-3V6c0-2.21-3.13-4-7-4zm0 2c3.31 0 6 .9 6 2s-2.69 2-6 2-6-.9-6-2 2.69-2 6-2zm-4 5h8v6H8V9zm-1 8c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
    </svg>
);

export default TrainIcon;