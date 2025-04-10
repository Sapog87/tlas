import React from 'react';
import {Link} from "react-router-dom";

function Header() {
    return (
        <div className="bg-[#e26d00] flex px-[25px] py-[10px] items-center">
            <div className="text-white text-[25px]">
                <Link to="/">
                    <div className="flex items-center">
                        <img className="mr-5" src="/logo.png" alt="logo" width="50"/>
                        <div className="text-3xl">Travel Logistics Analytical Service</div>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Header;
