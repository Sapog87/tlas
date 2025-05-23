import React, {useEffect, useState} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {addDays} from "date-fns";
import {ru} from "date-fns/locale";
import {useLocation, useNavigate} from "react-router-dom";
import {getNode, getSuggestions} from "../../api/SuggestService";

function Search({
                    handleSearchSubmit,
                    setData,
                    setNetworkError,
                    setLoading,
                    to,
                    setTo,
                    from,
                    setFrom,
                    toInput,
                    setToInput,
                    fromInput,
                    setFromInput
                }) {
    const [toFocused, setToFocused] = useState(false);
    const [fromFocused, setFromFocused] = useState(false);

    const [toSuggestions, setToSuggestions] = useState([]);
    const [fromSuggestions, setFromSuggestions] = useState([]);

    // const [toInput, setToInput] = useState("");
    // const [fromInput, setFromInput] = useState("");

    const [activeIndex, setActiveIndex] = useState(-1);

    // const [to, setTo] = useState({});
    // const [from, setFrom] = useState({});
    const [date, setDate] = useState(new Date());
    const [errors, setErrors] = useState({});

    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);

    const handleKeyDownFrom = (e) => {
        if (fromSuggestions.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) => (prev + 1) % fromSuggestions.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) =>
                prev <= 0 ? fromSuggestions.length - 1 : prev - 1
            );
        } else if (e.key === "Enter" && activeIndex >= 0) {
            const selected = fromSuggestions[activeIndex];
            setFrom({code: selected.id, title: selected.title});
            setFromInput(selected.title);
            setFromFocused(false);
            setFromSuggestions([]);
        }
    };

    const handleKeyDownTo = (e) => {
        if (toSuggestions.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) => (prev + 1) % toSuggestions.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) =>
                prev <= 0 ? toSuggestions.length - 1 : prev - 1
            );
        } else if (e.key === "Enter" && activeIndex >= 0) {
            const selected = toSuggestions[activeIndex];
            setTo({code: selected.id, title: selected.title});
            setToInput(selected.title);
            setToFocused(false);
            setToSuggestions([]);
        }
    };

    const handleSearch = () => {
        const newErrors = {};

        if (!to.code) newErrors["arrival"] = true;
        if (!from.code) newErrors["departure"] = true;
        if (!date) newErrors["date"] = true;
        if (to.code && from.code && to.code === from.code) newErrors["same"] = true;

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const params = new URLSearchParams();
        params.append("from", from.code);
        params.append("to", to.code);
        params.append("date", formattedDate);

        navigate(`/search?${params.toString()}`)
    };

    const clearError = (field) => {
        setErrors((prevErrors) => {
            const updatedErrors = {...prevErrors};
            delete updatedErrors[field];
            return updatedErrors;
        });
    };

    const now = new Date();
    const dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    useEffect(() => {
        setErrors({});

        const fromQuery = query.get("from");
        const toQuery = query.get("to");
        const dateQuery = query.get("date");

        const hasQuery = fromQuery || toQuery || dateQuery;

        if (hasQuery) {
            const checkStationsAndSubmit = async () => {
                try {
                    const _date = new Date(dateQuery);
                    setNetworkError(false)
                    setLoading(true);

                    const [from, to] = await Promise.all([
                        getNode(fromQuery).catch(() => setNetworkError(true)),
                        getNode(toQuery).catch(() => setNetworkError(true))
                    ]).finally(() => setLoading(false));

                    console.log(_date, dateOnly);
                    if (from.status === 200 && to.status === 200 && !isNaN(_date) && _date >= dateOnly && _date <= addDays(dateOnly, 90)) {
                        const fromJson = await from.json();
                        setFrom({"code": fromJson.id, "title": fromJson.title});
                        setFromInput(fromJson.title)

                        const toJson = await to.json();
                        setTo({"code": toJson.id, "title": toJson.title});
                        setToInput(toJson.title)

                        setDate(_date);

                        handleSearchSubmit(fromJson.id, toJson.id, dateQuery);
                    } else {
                        setData([])
                        setFrom({});
                        setTo({});
                        setFromInput("")
                        setToInput("")
                        const newErrors = {arrival: false, departure: false}
                        if (from.status === 200) {
                            const fromJson = await from.json();
                            setFrom({"code": fromJson.id, "title": fromJson.title});
                            setFromInput(fromJson.title)
                        } else {
                            newErrors.departure = true;
                            setFromInput("");
                        }
                        if (to.status === 200) {
                            const toJson = await to.json();
                            setTo({"code": toJson.id, "title": toJson.title});
                            setToInput(toJson.title)
                        } else {
                            newErrors.arrival = true;
                            setToInput("");
                        }
                        if (!isNaN(_date) && _date >= new Date() && _date <= addDays(new Date(), 90)) {
                            setDate(_date);
                        } else if (_date < dateOnly || _date > addDays(dateOnly, 90)) {
                            setDate(new Date());
                            newErrors.date = true;
                        } else {
                            setDate(new Date());
                            newErrors.date = true;
                        }
                        setErrors(newErrors)
                    }
                } catch (error) {
                    console.error("Ошибка при проверке станций:", error);
                }
            };

            checkStationsAndSubmit();
        }
    }, [location]);

    useEffect(() => {

    }, [navigate])

    return (
        <div
            className="gap-[5px] flex justify-center"
        >
            <div className="gap-[5px] flex justify-center">
                <div className="relative">
                    <input
                        className={`focus:shadow-[0_0_0_3px_#96dbfa] focus:outline-none p-[15px_20px] box-border rounded-l-[15px] border-none text-[20px] ${errors.departure ? "shadow-[0_0_0_3px_#ff004c] outline-none" : ''}`}
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
                                .then((suggestions) => {
                                    setFromSuggestions(suggestions);
                                    setActiveIndex(-1);
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        }}
                        onChange={(e) => {
                            setFromInput(e.target.value);
                            getSuggestions(e.target.value)
                                .then((suggestions) => suggestions.json())
                                .then((suggestions) => {
                                    setFromSuggestions(suggestions);
                                    setActiveIndex(-1);
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                            clearError("departure");
                        }}
                        onBlur={(e) => {
                            setTimeout(() => {
                                setFromFocused(false);
                            }, 100);
                        }}
                        onKeyDown={handleKeyDownFrom}
                    />
                    {fromFocused === true && fromSuggestions.length > 0 &&
                        <div
                            className="overflow-hidden absolute top-full mt-3 pt-2 pb-2 bg-white rounded-xl shadow-[5px_5px_20px_#d4d4d4] z-20">
                            {fromSuggestions.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`p-2 mb-2 cursor-pointer ${
                                        index === activeIndex ? "bg-[#96dbfa]" : "bg-white"
                                    }`}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onClick={(e) => {
                                        setFrom({"code": item.id, "title": item.title});
                                        setFromInput(item.title);
                                        clearError("departure");
                                    }}
                                >
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    }
                    {errors.departure &&
                        <div
                            className="absolute top-full mt-3 p-2 pb-2 bg-[#ff004c] text-white rounded-xl shadow-[5px_5px_20px_#d4d4d4] z-10"
                        >
                            Пункт отправления не найден
                        </div>
                    }
                </div>
                <div
                    className="absolute cursor-pointer z-30 m-4 p-1 rounded-xl bg-white shadow-[1px_1px_10px_#d4d4d4]"
                    onClick={() => {
                        const newErrors = {}
                        newErrors.arrival = errors.departure;
                        newErrors.departure = errors.arrival;
                        newErrors.date = errors.date;
                        newErrors.same = errors.same;
                        setErrors(newErrors)
                        const tempFrom = fromInput;
                        setFromInput(toInput);
                        setToInput(tempFrom);
                        setFrom({...to});
                        setTo({...from});
                    }}
                >
                    <svg height="20px" viewBox="0 0 24 24" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 10L21 7M21 7L18 4M21 7H7M6 14L3 17M3 17L6 20M3 17H17" stroke="#000000"
                              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <div className="relative">
                    <input
                        className={`focus:shadow-[0_0_0_3px_#96dbfa] focus:outline-none p-[15px_20px] box-border border-none text-[20px] ${errors.arrival || errors.same ? 'shadow-[0_0_0_3px_#ff004c] outline-none' : ''}`}
                        type="text"
                        value={toInput}
                        placeholder='Куда'
                        onFocus={(e) => {
                            setTimeout(() => {
                                setToFocused(true);
                            }, 100);
                            getSuggestions(e.target.value)
                                .then((suggestions) => suggestions.json())
                                .then((suggestions) => {
                                    setToSuggestions(suggestions)
                                    setActiveIndex(-1);
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        }}
                        onChange={(e) => {
                            setToInput(e.target.value);
                            getSuggestions(e.target.value)
                                .then((suggestions) => suggestions.json())
                                .then((suggestions) => {
                                    setToSuggestions(suggestions)
                                    setActiveIndex(-1);
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                            clearError('arrival');
                            clearError('same');
                        }}
                        onBlur={(e) => {
                            setTimeout(() => {
                                setToFocused(false);
                            }, 100);
                        }}
                        onKeyDown={handleKeyDownTo}
                    />
                    {toFocused === true && toSuggestions.length > 0 &&
                        <div
                            className="overflow-hidden absolute top-full mt-3 pt-2 pb-2 bg-white rounded-xl shadow-[5px_5px_20px_#d4d4d4] z-20">
                            {toSuggestions.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`p-2 mb-2 cursor-pointer ${
                                        index === activeIndex ? "bg-[#96dbfa]" : "bg-white"
                                    }`}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onClick={(e) => {
                                        setTo({"code": item.id, "title": item.title});
                                        setToInput(item.title);
                                        clearError('arrival');
                                        clearError('same');
                                    }}
                                >
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    }
                    {errors.arrival &&
                        <div
                            className="absolute top-full mt-3 p-2 pb-2 bg-[#ff004c] text-white rounded-xl shadow-[5px_5px_20px_#d4d4d4] z-10"
                        >
                            Пункт прибытия не найден
                        </div>
                    }
                    {errors.same &&
                        <div
                            className="absolute top-full mt-3 p-2 pb-2 bg-[#ff004c] text-white rounded-xl shadow-[5px_5px_20px_#d4d4d4] z-10"
                        >
                            Пункт прибытия совпадает с пунктом отправления
                        </div>
                    }
                </div>
            </div>
            <div className="relative">
                <div className="z-20">
                    <DatePicker
                        className={`focus:shadow-[0_0_0_3px_#96dbfa] focus:outline-none p-[15px_10px] box-border rounded-r-[15px] border-none text-[20px] ${errors.date ? 'shadow-[0_0_0_3px_#ff004c] outline-none' : ''}`}
                        type="text"
                        selected={date}
                        onChange={(date) => {
                            setDate(date);
                            clearError('date');
                        }}
                        placeholderText={'Отправление'}
                        showMonthYearDropdown
                        dateFormat="d MMMM"
                        maxDate={addDays(new Date(), 89)}
                        minDate={new Date()}
                        locale={ru}
                    />
                </div>
                {errors.date &&
                    <div
                        className="absolute top-full mt-3 p-2 pb-2 bg-[#ff004c] text-white rounded-xl shadow-[5px_5px_20px_#d4d4d4]"
                    >
                        Выберите корректную дату
                    </div>
                }
            </div>
            <button
                className="p-[15px] bg-[#96dbfa] text-white border-none rounded-[15px] ml-[10px] text-[20px] hover:bg-[#5fccff]"
                onClick={handleSearch}>
                Найти
            </button>
        </div>
    );
}

export default Search;
