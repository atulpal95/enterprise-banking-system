import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

function SpendingChart({ chartData = [] }) {

    return (

        <div className="dashboard-card spending-card">

            {/* HEADER */}
            <div className="card-header">

                <div>
                    <h3>Monthly Spending</h3>

                    <span>Current Year</span>
                </div>

            </div>


            {/* CHART */}
            <div className="chart-wrapper">

                {chartData.length === 0 ? (

                    <div className="chart-empty-state">

                        No Spending Data Available

                    </div>

                ) : (

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                        minWidth={0}
                        minHeight={0}
                    >

                        <AreaChart
                            data={chartData}
                            margin={{
                                top: 10,
                                right: 10,
                                left: 0,
                                bottom: 5,
                            }}
                        >

                            <defs>

                                <linearGradient
                                    id="colorSpend"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >

                                    <stop
                                        offset="5%"
                                        stopColor="#2563eb"
                                        stopOpacity={0.45}
                                    />

                                    <stop
                                        offset="95%"
                                        stopColor="#2563eb"
                                        stopOpacity={0}
                                    />

                                </linearGradient>

                            </defs>


                            <CartesianGrid
                                strokeDasharray="3 3"
                            />


                            <XAxis
                                dataKey="month"
                                tick={{
                                    fontSize: 12,
                                }}
                                tickMargin={8}
                            />


                            <YAxis
                                width={45}
                                tick={{
                                    fontSize: 11,
                                }}
                                tickFormatter={(value) =>
                                    `₹${Number(value).toLocaleString("en-IN")}`
                                }
                            />


                            <Tooltip
                                formatter={(value) => [
                                    `₹${Number(value).toLocaleString("en-IN")}`,
                                    "Spent",
                                ]}
                            />


                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#2563eb"
                                strokeWidth={3}
                                fill="url(#colorSpend)"
                                dot={false}
                                activeDot={{
                                    r: 5,
                                }}
                            />

                        </AreaChart>

                    </ResponsiveContainer>

                )}

            </div>

        </div>

    );
}

export default SpendingChart;