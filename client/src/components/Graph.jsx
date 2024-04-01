import React, { useState } from "react";
import Chart from "react-apexcharts";

const Graph = ({graphData}) => {

    console.log(graphData)

    let [state, setState] = useState({
        options: {
            colors: ["#1bc2eb", "#dc2626"],
            chart: {
                id: "basic-bar",
            },
            grid: {
                show: true,
                borderColor: '#ffffff30',
                strokeDashArray: 3,
                position: 'back',
            },
            xaxis: {
                categories: graphData.categories
            },
        },
        series: [
            graphData.series[0],
            graphData.series[1]
        ],
    })

    return (
        <div className="text-black">
            <Chart options={state.options} series={state.series} type="line" />
        </div>
    );
};

export default Graph;
