import React from 'react';
import {getPlaceType} from "../../Utils";

function ListRenderer({places}) {
    console.log(places);
    return (
        <div className="space-y-2">
            {places.map((place) => {
                const [number, gender] = /[МЖС]$/.test(place.number) ? [place.number.slice(0, -1), place.number[-1]] : [place.number, null]
                return (
                    <div className="flex justify-between shadow-inner rounded-xl p-2 bg-gray-300">
                        <div className="flex">
                            <div>
                                Место {number} [{place.serviceClass}] {place.kopecks / 100.0}₽
                            </div>
                        </div>
                        <div>
                            {getPlaceType(place.type)}
                        </div>
                    </div>
                )
            })}

        </div>
    );
}

export default ListRenderer;