import React, { useEffect, useState, useContext, useRef } from "react";
import Graph from "./Graph";
import { WebSocketContext } from "../contexts/WebSocketContext";
import { min } from "d3";

const LoadingSVG = () => (
    <svg width={"30px"} height={"30px"} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <g transform="rotate(0 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate>
            </rect>
        </g>
        <g transform="rotate(30 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
            </rect>
        </g>
        <g transform="rotate(60 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
            </rect>
        </g>
        <g transform="rotate(90 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
            </rect>
        </g>
        <g transform="rotate(120 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate>
            </rect>
        </g>
        <g transform="rotate(150 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
            </rect>
        </g>
        <g transform="rotate(180 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate>
            </rect>
        </g>
        <g transform="rotate(210 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
            </rect>
        </g>
        <g transform="rotate(240 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
            </rect>
        </g>
        <g transform="rotate(270 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate
                    attributeName="opacity"
                    values="1;0"
                    keyTimes="0;1"
                    dur="1s"
                    begin="-0.16666666666666666s"
                    repeatCount="indefinite"
                ></animate>
            </rect>
        </g>
        <g transform="rotate(300 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate
                    attributeName="opacity"
                    values="1;0"
                    keyTimes="0;1"
                    dur="1s"
                    begin="-0.08333333333333333s"
                    repeatCount="indefinite"
                ></animate>
            </rect>
        </g>
        <g transform="rotate(330 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
            </rect>
        </g>
    </svg>
);

const host ="powertracker-production.up.railway.app"

const SavedData = () => {
    let { log } = useContext(WebSocketContext);

    let [graphData, setGraphData] = useState(null);
    let [allDates, setAllDates] = useState([]);
    let [minmax, setminmax] = useState(null);

    useEffect(() => {
        log(host);

        fetch(`https://${host}/dates`)
            .then((res) => res.json())
            .then((data) => {
                log(data);
                if (data.length == 0) return setAllDates(["No Data"]);
                setAllDates(data);
            })
            .catch((error) => log(error));

        log(allDates);
    }, []);

    const handleSelect = () => {
        const value = selectRef.current.value;

        if (value === "realtime") {
            return;
        }

        setGraphData("loading");

        fetch(`https://${host}/dates/${value}`)
            .then((res) => res.json())
            .then((data) => {
                log(data);

                const dataForGraph = parseDataForGraph(data);

                log(dataForGraph);

                setTimeout(() => {
                    setGraphData(dataForGraph);
                    setminmax(getMinMax(dataForGraph));
                }, 2000);
            })
            .catch((error) => log(error));
    };

    const parseDataForGraph = (data) => {
        let categories = [];
        let inWatts = [];
        let outWatts = [];

        data.map((data) => categories.push(data.timestamp));
        data.map((data) => inWatts.push(data.inw));
        data.map((data) => outWatts.push(data.outw));

        const dataForGraph = {
            categories,
            series: [
                {
                    name: "Input Watt",
                    data: inWatts,
                },
                {
                    name: "Output Watt",
                    data: outWatts,
                },
            ],
        };

        return dataForGraph;
    };

    const getMinMax = (graphData) => {
        const inWattMin = Math.min(...graphData.series[0].data);
        const inWattMax = Math.max(...graphData.series[0].data);
        const outWattMin = Math.min(...graphData.series[1].data);
        const outWattMax = Math.max(...graphData.series[1].data);

        return { inWattMin, inWattMax, outWattMin, outWattMax };
    };

    const selectRef = useRef();

    return (
        <div className="p-3 w-full max-w-3xl mx-auto">
            <h4 className="text-xl font-bold">Saved Data</h4>

            <div className="p-3 flex justify-between items-start pt-8">
                {minmax ? (
                    <div>
                        <table>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td>IN</td>
                                    <td>OUT</td>
                                </tr>
                                <tr>
                                    <td>MIN</td>
                                    <td>
                                        <span className="text-cyan-500">{minmax.inWattMin}</span>
                                    </td>
                                    <td>
                                        <span className="text-red-500">{minmax.outWattMin}</span>
                                    </td>
                                </tr>

                                <tr>
                                    <td>MAX</td>
                                    <td>
                                        <span className="text-cyan-500">{minmax.inWattMax}</span>
                                    </td>
                                    <td>
                                        {" "}
                                        <span className="text-red-500">{minmax.outWattMax}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div></div>
                )}

                <select ref={selectRef} onChange={handleSelect} className="bg-slate-800 p-2 rounded-lg outline-none">
                    <option value="realtime">Select Date</option>
                    {allDates.map((date) => (
                        <option key={date} value={date}>
                            {date.replace(".json", "")}
                        </option>
                    ))}
                </select>
            </div>

            {graphData ? (
                graphData === "loading" ? (
                    <div className="w-full h-[10rem] flex justify-center items-center">
                        <LoadingSVG />
                    </div>
                ) : (
                    <div className="pr-5">
                        <Graph graphData={graphData} />
                    </div>
                )
            ) : (
                ""
            )}

            <div
                className={`${
                    allDates.length > 1 ? "hidden" : "flex"
                } w-full items-center justify-center py-10 rounded-lg border-2 border-dashed border-slate-700`}
            >
                <h3 className="text-slate-400">No data was saved</h3>
            </div>
        </div>
    );
};

export default SavedData;
