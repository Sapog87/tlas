import React from 'react';

function Sort({
                  ascending,
                  setAscending,
                  selectedSort,
                  setSelectedSort,
                  sortOptions
              }) {
    return (
        <div className="rounded-[20px] mb-8 flex">
            <button
                onClick={() => setAscending(!ascending)}
                className="bg-white px-4 py-2  rounded-2xl hover:bg-gray-50 transition mr-2 shadow-[10px_10px_10px_#d4d4d4]"
            >
                <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {ascending ? (
                        <>
                            <rect x="0" y="2" width="6" height="2" rx="1" fill="currentColor"/>
                            <rect x="0" y="7" width="12" height="2" rx="1" fill="currentColor"/>
                            <rect x="0" y="12" width="18" height="2" rx="1" fill="currentColor"/>
                        </>
                    ) : (
                        <>
                            <rect x="0" y="2" width="18" height="2" rx="1" fill="currentColor"/>
                            <rect x="0" y="7" width="12" height="2" rx="1" fill="currentColor"/>
                            <rect x="0" y="12" width="6" height="2" rx="1" fill="currentColor"/>
                        </>
                    )}
                </svg>
            </button>

            <div className="bg-white rounded-2xl flex justify-between flex-1 p-2.5 shadow-[10px_10px_10px_#d4d4d4]">
                {sortOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => setSelectedSort(option.id)}
                        className={`px-4 py-2 rounded-xl transition ${
                            selectedSort === option.id
                                ? "bg-[#96dbfa] text-white shadow-inner"
                                : "text-black border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Sort;