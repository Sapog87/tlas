import React, {useEffect, useState} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {addDays} from "date-fns";
import {ru} from "date-fns/locale";
import {useLocation, useNavigate} from "react-router-dom";
import {getNode, getSuggestions} from "../../api/SuggestService";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Search({handleSearchSubmit}) {
    const [toFocused, setToFocused] = useState(false);
    const [fromFocused, setFromFocused] = useState(false);

    const [toSuggestions, setToSuggestions] = useState([]);
    const [fromSuggestions, setFromSuggestions] = useState([]);

    const [toInput, setToInput] = useState("");
    const [fromInput, setFromInput] = useState("");

    const [to, setTo] = useState({});
    const [from, setFrom] = useState({});
    const [date, setDate] = useState(new Date());
    const [errors, setErrors] = useState({});
    const query = useQuery();

    const navigate = useNavigate();

    const handleSearch = () => {
        const newErrors = {};

        if (!to.code) newErrors["departure"] = true;
        if (!from.code) newErrors["arrival"] = true;
        if (!date) newErrors["date"] = true;

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        const formattedDate = date.toISOString().split('T')[0];

        const params = new URLSearchParams();
        params.append("from", from.code);
        params.append("to", to.code);
        params.append("date", formattedDate);

        navigate(`/search?${params.toString()}`)

        handleSearchSubmit(from.code, to.code, formattedDate)
    };

    const clearError = (field) => {
        setErrors((prevErrors) => {
            const updatedErrors = {...prevErrors};
            delete updatedErrors[field];
            return updatedErrors;
        });
    };

    useEffect(() => {
        const fromQuery = query.get("from");
        const toQuery = query.get("to");
        const dateQuery = query.get("date");

        const hasQuery = fromQuery || toQuery || dateQuery;

        if (hasQuery) {
            const checkStationsAndSubmit = async () => {
                try {
                    const [from, to] = await Promise.all([
                        getNode(fromQuery),
                        getNode(toQuery)
                    ]);

                    if (from.status === 200 && to.status === 200) {
                        const fromJson = await from.json();
                        setFrom({"code": fromJson.id, "title": fromJson.title});
                        setFromInput(fromJson.title)

                        const toJson = await to.json();
                        setTo({"code": toJson.id, "title": toJson.title});
                        setToInput(toJson.title)

                        setDate(dateQuery ? new Date(dateQuery) : new Date());

                        handleSearchSubmit(fromQuery, toQuery, dateQuery);
                    } else {
                        if (from.status !== 200) {
                            // setErrors((prevErrors) => {prevErrors.departure = true;});
                        }
                    }
                } catch (error) {
                    console.error("Ошибка при проверке станций:", error);
                }
            };

            checkStationsAndSubmit();
        }
    }, []);

    return (
        <div
            className="gap-[5px] flex justify-center"
        >
            <div className="relative">
                <input
                    className={`focus:shadow-[0_0_0_3px_#96dbfa] focus:outline-none p-[15px_10px] box-border rounded-l-[15px] border-none text-[20px] ${errors.departure ? "shadow-[0_0_0_3px_#ff004c] outline-none" : ''}`}
                    type="text"
                    value={fromInput}
                    placeholder='Откуда'
                    onFocus={(e) => {
                        setTimeout(() => {
                            setFromFocused(true);
                        }, 100);
                        getSuggestions(e.target.value)
                            .then((suggestions) =>
                                suggestions.json()
                            )
                            .then((suggestions) => setFromSuggestions(suggestions));
                    }}
                    onChange={(e) => {
                        setFromInput(e.target.value);
                        getSuggestions(e.target.value)
                            .then((suggestions) => suggestions.json())
                            .then((suggestions) => setFromSuggestions(suggestions));
                        clearError('departure');
                    }}
                    onBlur={(e) => {
                        setTimeout(() => {
                            setFromFocused(false);
                        }, 100);
                    }}
                />
                {fromFocused === true && fromSuggestions.length > 0 &&
                    <div
                        className="overflow-hidden absolute top-full mt-3 pt-2 pb-2 bg-white rounded-xl shadow-[5px_5px_20px_#d4d4d4] z-10">
                        {fromSuggestions.map((item) => (
                            <div
                                className="hover:bg-[#96dbfa] p-2 mb-2"
                                onClick={(e) => {
                                    setFrom({"code": item.id, "title": item.title});
                                    setFromInput(item.title);
                                }}
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>
                }
            </div>
            <div className="relative">
                <input
                    className={`focus:shadow-[0_0_0_3px_#96dbfa] focus:outline-none p-[15px_10px] box-border border-none text-[20px] ${errors.arrival ? 'shadow-[0_0_0_3px_#ff004c] outline-none' : ''}`}
                    type="text"
                    value={toInput}
                    placeholder='Куда'
                    onFocus={(e) => {
                        setTimeout(() => {
                            setToFocused(true);
                        }, 100);
                        getSuggestions(e.target.value)
                            .then((suggestions) => suggestions.json())
                            .then((suggestions) => setToSuggestions(suggestions));
                    }}
                    onChange={(e) => {
                        setToInput(e.target.value);
                        getSuggestions(e.target.value)
                            .then((suggestions) => suggestions.json())
                            .then((suggestions) => setToSuggestions(suggestions));
                        clearError('arrival');
                    }}
                    onBlur={(e) => {
                        setTimeout(() => {
                            setToFocused(false);
                        }, 100);
                    }}
                />
                {toFocused === true && toSuggestions.length > 0 &&
                    <div
                        className="overflow-hidden absolute top-full mt-3 pt-2 pb-2 bg-white rounded-xl shadow-[5px_5px_20px_#d4d4d4] z-10">
                        {toSuggestions.map((item) => (
                            <div
                                className="hover:bg-[#96dbfa] p-2"
                                onClick={(e) => {
                                    setTo({"code": item.id, "title": item.title});
                                    setToInput(item.title);
                                }}
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>
                }
            </div>
            <div className="flex flex-col">
                <DatePicker
                    className={`focus:shadow-[0_0_0_3px_#96dbfa] focus:outline-none p-[15px_10px] box-border rounded-r-[15px] border-none text-[20px] ${errors.date ? 'shadow-[0_0_0_3px_#ff004c] outline-none' : ''}`}
                    type="text"
                    placeholder="Когда"
                    selected={date}
                    onChange={(date) => {
                        setDate(date);
                        clearError('date');
                    }}
                    showMonthYearDropdown
                    dateFormat="d MMMM"
                    maxDate={addDays(new Date(), 44)}
                    minDate={new Date()}
                    locale={ru}
                />
            </div>
            <button
                className="p-[15px] bg-[#96dbfa] text-white border-none cursor-pointer rounded-[15px] ml-[10px] text-[20px] hover:bg-[#5fccff]"
                onClick={handleSearch}>
                Найти
            </button>
        </div>
    );
}

export default Search;
