import React, {useEffect, useRef, useState} from "react";
import SVG from 'react-inlinesvg';
import root from 'react-shadow';
import {getPlaceType} from "../Utils";

const decodeSvgString = (raw) => {
    const unescaped = raw
        .replace(/\\r\\n/g, "")
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\\\/g, "\\");

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(unescaped, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;

    return new XMLSerializer().serializeToString(svgElement);
};

const SvgRenderer = ({rawSvg, places}) => {
    const svgRef = useRef(null)
    const [svg, setSvg] = useState(null)
    const containerRef = useRef(null);
    const [tooltip, setTooltip] = useState({visible: false, price: 0, text: "", type: "", class: "", x: 0, y: 0});

    useEffect(() => {
        if (!svgRef.current) return;

        console.log(svgRef)

        places.forEach((place) => {
            const [number, gender] = /[МЖС]$/.test(place.number) ? [place.number.slice(0, -1), place.number[-1]] : [place.number, 'С']
            const seat = svgRef.current.getElementById("Seat" + number);
            if (seat) {
                seat.style.stroke = '#5583de';
                seat.style.fill = '#81bfff';

                const handleMouseEnter = (e) => {
                    const rect = e.target.getBoundingClientRect();
                    const containerRect = containerRef.current.getBoundingClientRect();

                    setTooltip({
                        visible: true,
                        text: `Место ${number}`,
                        price: place.kopecks / 100.0,
                        type: getPlaceType(place.type),
                        x: rect.left - containerRect.left + rect.width / 2,
                        y: rect.top - containerRect.top + rect.height + 8,
                    });
                };

                const handleMouseLeave = () => {
                    setTooltip((t) => ({...t, visible: false}));
                };

                seat.addEventListener("mouseenter", handleMouseEnter);
                seat.addEventListener("mouseleave", handleMouseLeave);

                return () => {
                    seat.removeEventListener("mouseenter", handleMouseEnter);
                    seat.removeEventListener("mouseleave", handleMouseLeave);
                };
            }
        });

    }, [svg])

    return (
        <div ref={containerRef} className="relative inline-block">
            <root.div>
                <SVG
                    src={rawSvg}
                    innerRef={svgRef}
                    width="900px"
                    height="150px"
                    loader={<span>Loading...</span>}
                    preProcessor={decodeSvgString}
                    onLoad={() => {
                        setSvg({})
                    }}
                />
            </root.div>

            {tooltip.visible && (
                <div
                    style={{
                        position: "absolute",
                        left: tooltip.x,
                        top: tooltip.y,
                        background: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        pointerEvents: "none",
                        whiteSpace: "nowrap",
                        zIndex: 999,
                        transform: "translate(-50%, 0)",
                    }}
                >
                    <div>
                        {tooltip.text}
                    </div>
                    <div>
                        {tooltip.type}
                    </div>
                    <div>
                        {tooltip.price}₽
                    </div>
                </div>
            )}
        </div>
    );
};

export default SvgRenderer;