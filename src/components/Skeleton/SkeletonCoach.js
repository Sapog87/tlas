import React from 'react';
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

function SkeletonCoach() {
    return (
        <div className="mt-[15px]">
            <div>
                <div className="shadow-inner bg-gray-200 rounded-xl">
                    <div className="p-5 text-2xl">
                        <Skeleton className='mb-3' width={200} height={30}/>
                        <Skeleton width={900} height={100}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SkeletonCoach;