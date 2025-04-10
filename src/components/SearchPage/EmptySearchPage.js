import React from 'react';
import Search from "../Search/Search";
import {useNavigate} from "react-router-dom";
import Header from "../Header/Header";

function EmptySearchPage(props) {
    const navigate = useNavigate();

    const handleSearchSubmit = (from, to, date) => {
        const params = new URLSearchParams();
        if (from) params.append("from", from);
        if (to) params.append("to", to);
        if (date) params.append("date", date);

        navigate(`/search?${params.toString()}`)
    }

    return (
        <div className="top-large">
            <Header/>
            <div
                className="bg-[#e26d00] py-[150px] shadow-[10px_10px_10px_#d4d4d4]"
            >
                <Search
                    className=""
                    handleSearchSubmit={handleSearchSubmit}/>
            </div>
        </div>
    );
}

export default EmptySearchPage;