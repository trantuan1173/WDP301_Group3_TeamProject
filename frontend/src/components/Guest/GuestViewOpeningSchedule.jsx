import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";
import LoadingSpinner from "../../components/LoadingSpinner";
const TYPE_LIST = [
    { key: "toeic", label: "TOEIC" },
    { key: "ielts", label: "IELTS" }
];

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export default function GuestViewOpemingSchedule() {
    const [type, setType] = useState("toeic");
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(new Date().getFullYear());
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);
            try {
                const res = await axios.get(API_ENDPOINTS.GUEST_VIEW_OPENDAY_SCHEDULE);
                setClasses(res.data.data || []);
            } catch (err) {
                setClasses([]);
            }
            setLoading(false);
        };
        fetchClasses();
    }, []);

    // Lấy các năm có lớp theo type
    const yearsAvailable = Array.from(
        new Set([
            ...classes
                .filter(cls => cls.course?.detail?.type === type)
                .map(cls => new Date(cls.start_time).getFullYear()),
            new Date().getFullYear()
        ])
    ).sort((a, b) => a - b);

    // Lấy các tháng có lớp theo type và năm
    const monthsAvailable = Array.from(
        new Set(
            classes
                .filter(cls => {
                    const courseType = cls.course?.detail?.type;
                    const classYear = new Date(cls.start_time).getFullYear();
                    return courseType === type && (year ? classYear === year : true);
                })
                .map(cls => new Date(cls.start_time).getMonth() + 1)
        )
    ).sort((a, b) => a - b);

    // Lọc theo type, năm, tháng
    const filteredClasses = classes.filter(cls => {
        const courseType = cls.course?.detail?.type;
        const startMonth = new Date(cls.start_time).getMonth() + 1;
        const startYear = new Date(cls.start_time).getFullYear();
        return (
            courseType === type &&
            (year ? startYear === year : true) &&
            (month ? startMonth === month : true)
        );
    });

    return (
        <div className="">
            <div className="max-w-[1400px] mx-auto mt-8 mb-16 bg-white rounded-xl shadow p-8">
                <h2
                    className="text-[36px] font-extrabold leading-[100%] mb-6"
                    style={{ color: "#0C035B", fontFamily: "Inter, Arial, sans-serif" }}
                >
                    OPENING SCHEDULE
                </h2>
                {/* Tabs type */}
                {loading ? <LoadingSpinner loading={loading} size={100} /> : (
                    <div>
                        <div className="flex gap-4 mb-4">
                            {TYPE_LIST.map(t => (
                                <button
                                    key={t.key}
                                    onClick={() => { setType(t.key); setMonth(null); setYear(new Date().getFullYear()); }}
                                    className={`px-6 py-2 font-bold rounded ${type === t.key ? "bg-orange-500 text-white" : "bg-gray-200 text-[#1a237e]"}`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Chọn năm & tháng cùng dòng */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="font-semibold mr-2">YEAR</span>
                            <select
                                value={year || ""}
                                onChange={e => {
                                    setYear(e.target.value ? Number(e.target.value) : new Date().getFullYear());
                                    setMonth(null);
                                }}
                                className="px-4 py-2 rounded font-bold text-base border border-[#1a237e] bg-white text-[#1a237e] focus:outline-none"
                                style={{ minWidth: 100 }}
                            >
                                {yearsAvailable.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            <span className="font-semibold ml-6 mr-2">MONTH</span>
                            <div className="flex gap-2">
                                {monthsAvailable.map(m => (
                                    <button
                                        key={m}
                                        onClick={() => setMonth(month === m ? null : m)}
                                        className={`px-4 py-2 rounded font-bold text-base transition-all
                  ${month === m ? "bg-orange-500 text-white" : "bg-gray-200 text-[#1a237e]"}
                `}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table
                                className="border border-[#222] rounded-xl overflow-hidden"
                                style={{ minWidth: 1200, borderCollapse: "separate", borderSpacing: 0 }}
                            >
                                <thead>
                                    <tr className="bg-[#1a237e] text-white">
                                        <th className="py-3 px-4 font-bold" style={{ width: 220 }}>Course</th>
                                        <th className="py-3 px-4 font-bold" style={{ width: 120 }}>Level</th>
                                        <th className="py-3 px-4 font-bold" style={{ width: 220 }}>Class</th>
                                        <th className="py-3 px-4 font-bold" style={{ width: 120 }}>Duration</th>
                                        <th className="py-3 px-4 font-bold" style={{ width: 180 }}>Start time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-8 border-b border-gray-300">Loading...</td>
                                        </tr>
                                    ) : filteredClasses.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-8 border-b border-gray-300">No classes found in this month.</td>
                                        </tr>
                                    ) : (
                                        filteredClasses.map(cls => (
                                            <tr key={cls._id} className="border-b border-gray-300">
                                                <td className="py-2 px-4" style={{ width: 220 }}>{cls.course?.detail?.courseId?.nameCourses || cls.course?.name || ""}</td>
                                                <td className="py-2 px-4" style={{ width: 120 }}>{cls.course?.detail?.level || ""}</td>
                                                <td className="py-2 px-4" style={{ width: 220 }}>{cls.className}</td>
                                                <td className="py-2 px-4" style={{ width: 120 }}>{cls.course?.detail?.durationDays || ""} Days</td>
                                                <td className="py-2 px-4" style={{ width: 180 }}>{formatDate(cls.start_time)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}