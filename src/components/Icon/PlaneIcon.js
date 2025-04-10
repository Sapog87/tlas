import React from "react";

const PlaneIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.size || 24}
        height={props.size || 24}
        viewBox="0 0 24 24"
        fill="#66ccff"
        {...props}
    >
        <path d="M21 16v-2l-8-5V3.5a.5.5 0 0 0-1 0V9l-8 5v2l8-2.5V21l-2 1v1l3-.5 3 .5v-1l-2-1v-7.5l8 2.5z" />
    </svg>
);

export default PlaneIcon;