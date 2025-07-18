// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//     AreaChart,
//     Area,
//     XAxis,
//     YAxis,
//     Tooltip,
//     ResponsiveContainer,
// } from "recharts";
// import { format, isWithinInterval } from "date-fns";
// import CourseViewChart from "./CourseViewChart";
// import CourseRevenueChart from "./CourseRevenueChart";
// import { API_ENDPOINTS } from "../../../config";

// const AdminStatistics = () => {
//     const [events, setEvents] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);
//     const [startDate, setStartDate] = useState(new Date("2025-06-29T00:00:00"));
//     const [endDate, setEndDate] = useState(new Date("2025-06-30T00:00:00"));

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const res = await axios.get(API_ENDPOINTS.GET_STATISTICS_EVENT("pageView"));
//                 setEvents(res.data.data);
//             } catch (error) {
//                 console.error("Fetch pageView error:", error);
//             }
//         };
//         fetchData();
//     }, []);

//     useEffect(() => {
//         const grouped = {};
//         events.forEach((event) => {
//             const time = new Date(event.eventTime);
//             if (isWithinInterval(time, { start: startDate, end: endDate })) {
//                 const labelFormat = (endDate - startDate) / (1000 * 60 * 60 * 24) <= 1
//                     ? "HH:mm"
//                     : "yyyy-MM-dd";
//                 const label = format(time, labelFormat);
//                 grouped[label] = (grouped[label] || 0) + 1;
//             }
//         });

//         const result = Object.entries(grouped).map(([time, count]) => ({
//             time,
//             count,
//         }));

//         setFilteredData(result);
//     }, [events, startDate, endDate]);

//     return (
//         <div className="p-6">
//             <div className="bg-white shadow rounded-2xl p-6">
//                 <h2 className="text-2xl font-bold text-indigo-600 mb-4 text-center">Number of visits</h2>

//                 <div className="flex gap-4 mb-6 items-center">
//                     <label className="text-sm font-medium">From:</label>
//                     <input
//                         type="datetime-local"
//                         className="border rounded px-2 py-1"
//                         value={format(startDate, "yyyy-MM-dd'T'HH:mm")}
//                         onChange={(e) => setStartDate(new Date(e.target.value))}
//                     />
//                     <label className="text-sm font-medium">To:</label>
//                     <input
//                         type="datetime-local"
//                         className="border rounded px-2 py-1"
//                         value={format(endDate, "yyyy-MM-dd'T'HH:mm")}
//                         onChange={(e) => setEndDate(new Date(e.target.value))}
//                     />
//                 </div>

//                 <ResponsiveContainer width="100%" height={320}>
//                     <AreaChart data={filteredData}>
//                         <XAxis dataKey="time" />
//                         <YAxis allowDecimals={false} />
//                         <Tooltip />
//                         <Area
//                             type="monotone"
//                             dataKey="count"
//                             stroke="#60a5fa"
//                             fill="#93c5fd"
//                             strokeWidth={2}
//                         />
//                     </AreaChart>
//                 </ResponsiveContainer>
//                 <div className="flex gap-4 mt-6 mx-6 justify-center">
//                     <div className="flex-1 min-w-0">
//                         <CourseViewChart />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                         <CourseRevenueChart />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminStatistics;


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
    const now = new Date();
    const [events, setEvents] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [startDate, setStartDate] = useState(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)); // 7 ngày trước
    const [endDate, setEndDate] = useState(now); // hôm nay

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
        const diffInDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

        let labelFormat = "yyyy-MM-dd";
        if (diffInDays <= 1) labelFormat = "HH:mm";
        else if (diffInDays <= 3) labelFormat = "MM-dd HH:mm";
        else if (diffInDays <= 30) labelFormat = "MM-dd";
        else labelFormat = "yyyy-MM";

        events.forEach((event) => {
            const time = new Date(event.eventTime);
            if (isWithinInterval(time, { start: startDate, end: endDate })) {
                const label = format(time, labelFormat);
                grouped[label] = (grouped[label] || 0) + 1;
            }
        });

        const result = Object.entries(grouped)
            .map(([time, count]) => ({ time, count }))
            .sort((a, b) => new Date(a.time) - new Date(b.time));

        setFilteredData(result);
    }, [events, startDate, endDate]);

    const quickSelect = (days) => {
        const now = new Date();
        setStartDate(new Date(now.getTime() - days * 24 * 60 * 60 * 1000));
        setEndDate(now);
    };

    return (
        <div className="p-6">
            <div className="bg-white shadow rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-indigo-600 mb-4 text-center">Number of visits</h2>

                {/* Chọn thời gian */}
                <div className="flex flex-wrap gap-4 mb-6 items-center">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">From:</label>
                        <input
                            type="datetime-local"
                            className="border rounded px-2 py-1"
                            value={format(startDate, "yyyy-MM-dd'T'HH:mm")}
                            onChange={(e) => setStartDate(new Date(e.target.value))}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">To:</label>
                        <input
                            type="datetime-local"
                            className="border rounded px-2 py-1"
                            value={format(endDate, "yyyy-MM-dd'T'HH:mm")}
                            onChange={(e) => setEndDate(new Date(e.target.value))}
                        />
                    </div>

                    <div className="flex gap-2 ml-auto">
                        <button
                            onClick={() => quickSelect(1)}
                            className="px-3 py-1 text-sm border rounded hover:bg-indigo-100"
                        >
                            Last 1 Day
                        </button>
                        <button
                            onClick={() => quickSelect(7)}
                            className="px-3 py-1 text-sm border rounded hover:bg-indigo-100"
                        >
                            Last 7 Days
                        </button>
                        <button
                            onClick={() => quickSelect(30)}
                            className="px-3 py-1 text-sm border rounded hover:bg-indigo-100"
                        >
                            Last 30 Days
                        </button>
                    </div>
                </div>

                {/* Biểu đồ */}
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

                {/* Các biểu đồ khác */}
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