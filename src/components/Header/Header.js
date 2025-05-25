import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";

function Header({
                    logged,
                    setLogged,
                    user,
                    setShowLoginModal
                }) {
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="bg-orange-500 px-[25px] py-[10px] flex justify-center">
            <div className="w-full text-white text-[25px] flex justify-between items-center max-w-[1300px]">
                <Link to="/">
                    <div className="flex items-center">
                        <img className="mr-5" src={process.env.PUBLIC_URL + "/logo.png"} alt="logo" width="50"/>
                        <div className="text-3xl">Travel Logistics Analytical Service</div>
                    </div>
                </Link>

                {!logged &&
                    <button
                        className="bg-white text-black text-xl p-2 rounded-xl hover:bg-gray-50"
                        onClick={() => setShowLoginModal(true)}
                    >Войти
                    </button>
                }

                {logged &&
                    <Link to="/profile">
                        <div className="relative inline-block">
                            <button
                                className="size-11 rounded-full bg-white hover:bg-gray-50"
                                onBlur={() => setTimeout(() => setShowMenu(false), 100)}
                            >
                                <svg
                                    viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="9" r="3" stroke="#96dbfa" strokeWidth="1.5"/>
                                    <path
                                        d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20"
                                        stroke="#96dbfa" strokeWidth="1.5" strokeLinecap="round"/>
                                    <path
                                        d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
                                        stroke="#96dbfa" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>
                    </Link>
                }
            </div>
        </div>
    );
}

export default Header;
