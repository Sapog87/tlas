import React, { useEffect, useState } from 'react';

function ProgressBar({ loading }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval;

        if (loading) {
            setProgress(0);
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev < 90) {
                        return prev + 0.5;
                    } else {
                        return prev;
                    }
                });
            }, 200);
        } else {
            setProgress(100);
            setTimeout(() => setProgress(0), 500);
        }

        return () => clearInterval(interval);
    }, [loading]);

    return (
        <div className="w-full h-1 overflow-hidden">
            <div
                className="h-full bg-[#96dbfa] transition-transform duration-300 origin-center"
                style={{
                    transform: `scaleX(${progress / 100})`
                }}
            />
        </div>
    );
}

export default ProgressBar;