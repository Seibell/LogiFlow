import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import React from 'react'

function SimulationsChart({ target, value }) {
    const data = [
        {
            "name": "Total Container Throughput (1000 TEU)",
            "target": target,
            "value": value
        }   
    ]

    return (
            <ResponsiveContainer width="100%" height="60%" style={{ display: "flex", justifyContent: "center" }}>
                <BarChart
                    width={730}
                    height={300}
                    data={data}
                    barSize={150}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis/>
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="target" fill="#8884d8" />
                    <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
    )
}

export default SimulationsChart