import { useEffect, useState } from "react";
import axios from "axios";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { format, isWithinInterval } from "date-fns";
import CourseViewChart from "./CourseViewChart";
import CourseRevenueChart from "./CourseRevenueChart";
import { API_ENDPOINTS } from "../../../config";

const AdminStatistics = () => {
    const [events, setEvents] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [startDate, setStartDate] = useState(new Date("2025-06-29T00:00:00"));
    const [endDate, setEndDate] = useState(new Date("2025-06-30T00:00:00"));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(API_ENDPOINTS.GET_STATISTICS_EVENT("pageView"));
                setEvents(res.data.data);
            } catch (error) {
                console.error("Fetch pageView error:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const grouped = {};
        events.forEach((event) => {
            const time = new Date(event.eventTime);
            if (isWithinInterval(time, { start: startDate, end: endDate })) {
                const labelFormat = (endDate - startDate) / (1000 * 60 * 60 * 24) <= 1
                    ? "HH:mm"
                    : "yyyy-MM-dd";
                const label = format(time, labelFormat);
                grouped[label] = (grouped[label] || 0) + 1;
            }
        });

        const result = Object.entries(grouped).map(([time, count]) => ({
            time,
            count,
        }));

        setFilteredData(result);
    }, [events, startDate, endDate]);

    return (
        <div className="p-6">
            <div className="bg-white shadow rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-indigo-600 mb-4 text-center">Number of visits</h2>

                <div className="flex gap-4 mb-6 items-center">
                    <label className="text-sm font-medium">From:</label>
                    <input
                        type="datetime-local"
                        className="border rounded px-2 py-1"
                        value={format(startDate, "yyyy-MM-dd'T'HH:mm")}
                        onChange={(e) => setStartDate(new Date(e.target.value))}
                    />
                    <label className="text-sm font-medium">To:</label>
                    <input
                        type="datetime-local"
                        className="border rounded px-2 py-1"
                        value={format(endDate, "yyyy-MM-dd'T'HH:mm")}
                        onChange={(e) => setEndDate(new Date(e.target.value))}
                    />
                </div>

                <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={filteredData}>
                        <XAxis dataKey="time" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#60a5fa"
                            fill="#93c5fd"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-6 mx-6 justify-center">
                    <div className="flex-1 min-w-0">
                        <CourseViewChart />
                    </div>
                    <div className="flex-1 min-w-0">
                        <CourseRevenueChart />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminStatistics;