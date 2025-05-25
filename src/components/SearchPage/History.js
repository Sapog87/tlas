import React, {useEffect, useState} from 'react';
import {favorite, history, removeHistory} from "../../api/SearchHistoryService";
import Skeleton from "react-loading-skeleton";

function History({
                     callback,
                 }) {
    const [searchHistory, setSearchHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                setLoading(true);
                history(token)
                    .then(response => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            return [];
                        }
                    })
                    .then(data => {
                        setSearchHistory(data)
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(() => setLoading(false));
            }
        };

        checkAuth();
    }, []);

    if (searchHistory && searchHistory.length > 0) {
        return (
            <div className="p-2">
                {searchHistory.map((item, index) => (
                    <div className="flex gap-2 mb-1">
                        <div
                            className="cursor-pointer"
                            onClick={() => {
                                const token = localStorage.getItem("token");
                                favorite(token, item.from, item.to, !searchHistory[index].isFavorite);
                                setSearchHistory(prev =>
                                    prev.map((entry, i) =>
                                        i === index
                                            ? {...entry, isFavorite: !entry.isFavorite}
                                            : entry
                                    )
                                );
                            }}
                        >
                            {(() => {
                                return item.isFavorite ? "❤️️" : "🤍️"
                            })()}
                        </div>
                        <div
                            className="cursor-pointer w-[85%]"
                        >
                            <div className="truncate"
                                 onClick={() => {
                                     callback(item)
                                 }}
                            >
                                {item.fromTitle} — {item.toTitle}
                            </div>
                        </div>
                        <div
                            className="cursor-pointer text-gray-400"
                            onClick={() => {
                                const token = localStorage.getItem("token");
                                removeHistory(token, item.from, item.to);
                                setSearchHistory(prev =>
                                    prev.filter((_, i) => i !== index)
                                );
                            }}
                        >
                            ✖
                        </div>
                    </div>
                ))}
            </div>
        );
    } else if (loading) {
        return (
            <div>
                {[...Array(10)].map((_, idx) => (
                    <div className="flex gap-5">
                        <Skeleton circle width={15} height={15}/>
                        <Skeleton height={15} width={300}/>
                    </div>
                ))}
            </div>
        )
    } else {
        return (
            <div className="flex justify-center mb-4">
                <div>
                    <div className="p-10 flex justify-center">
                        <svg width="70px" height="70px" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"
                             aria-hidden="true" role="img"
                             className="iconify iconify--twemoji" preserveAspectRatio="xMidYMid meet">
                            <path fill="#9AAAB4" d="M27.388 24.642L24.56 27.47l-4.95-4.95l2.828-2.828z"></path>
                            <path fill="#66757F"
                                  d="M34.683 29.11l-5.879-5.879a2 2 0 0 0-2.828 0l-2.828 2.828a2 2 0 0 0 0 2.828l5.879 5.879a4 4 0 1 0 5.656-5.656z"></path>
                            <circle fill="#8899A6" cx="13.586" cy="13.669" r="13.5"></circle>
                            <circle fill="#BBDDF5" cx="13.586" cy="13.669" r="9.5"></circle>
                        </svg>
                    </div>
                    <div className="font-bold text-xl">Похоже вы еще ничего не искали</div>
                </div>
            </div>
        )
    }

}

export default History;