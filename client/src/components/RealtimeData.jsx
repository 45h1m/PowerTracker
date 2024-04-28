import React, { useContext, useState } from "react";
import { WebSocketContext } from "../contexts/WebSocketContext";
import StatelessGraph from "./StatelessGraph";

const RealtimeData = () => {
    let { currentData, realtimeBuffer } = useContext(WebSocketContext);

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

    const graphData = parseDataForGraph(realtimeBuffer);

    return (
        <div className="w-full max-w-3xl mx-auto">
            <h4 className="text-xl font-bold pl-3">Realtime Data</h4>

            <div className="max-w-lg pt-5">
                <div className="flex justify-end pr-6">
                    
                </div>

                {currentData ? (
                    <>
                        <div className="flex gap-2 p-3">
                            <div className="flex flex-col flex-1 bg-cyan-900 p-3 gap-2 rounded-lg">
                                <div className="flex flex-col justify-between">
                                    <p className="opacity-50 w-full pb-2">Charging</p>
                                    <h4 className="text-nowrap text-white bg-cyan-600 rounded-lg px-3 py-2 text-2xl font-bold">
                                        {currentData.inw} W
                                    </h4>
                                </div>

                                <div className="flex justify-between px-3">
                                    <div className="flex items-end gap-2">
                                        <h4 className="text-lg font-bold">{currentData.inv} V</h4>
                                    </div>

                                    <div className="flex items-end gap-2 pl-3">
                                        <h4 className="text-lg font-bold">{currentData.ina} mA</h4>
                                    </div>
                                </div>

                                <p className="text-[0.7rem] w-fit opacity-50 bg-gray-900 p-1 px-2 rounded-lg">{currentData.timestamp}</p>
                            </div>
                            <div className="flex flex-col flex-1 bg-red-800 p-3 gap-2 rounded-lg">
                                <div className="flex flex-col justify-between">
                                    <p className="opacity-50 w-full pb-2">Draining</p>
                                    <h4 className="text-nowrap text-white bg-red-600 rounded-lg px-3 py-2 text-2xl font-bold">
                                        {currentData.outw} W
                                    </h4>
                                </div>

                                <div className="flex justify-between px-3">
                                    <div className="flex items-end gap-2">
                                        <h4 className="text-lg font-bold">{currentData.outv} V</h4>
                                    </div>

                                    <div className="flex items-end gap-2 pl-3">
                                        <h4 className="text-lg font-bold">{currentData.outa} mA</h4>
                                    </div>
                                </div>

                                <p className="text-[0.7rem] w-fit opacity-50 bg-gray-900 p-1 px-2 rounded-lg">{currentData.timestamp}</p>
                            </div>
                        </div>

                        <div className="pr-8">
                        <StatelessGraph graphData={graphData} width={100}/>

                        </div>

                    </>
                ) : (
                    <div className="p-3">
                        <div className="w-full flex items-center justify-center py-10 rounded-lg border-2 border-dashed border-slate-700">
                            <h3 className="text-slate-400">Waiting for device to come online</h3>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RealtimeData;
