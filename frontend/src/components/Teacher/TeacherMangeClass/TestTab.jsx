// frontend/src/components/Teacher/TeacherMangeClass/TestTab.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faFileExport, faSearch, faDownload } from "@fortawesome/free-solid-svg-icons";
import ChooseTestModal from "../teacherModal/ChooseTestModal";
import AssignTestModal from "../teacherModal/AssignTestModal";

const TestTab = ({ classId, courseId }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showChooseModal, setShowChooseModal] = useState(false);
    const [assignData, setAssignData] = useState([]);
    const [courseName, setCourseName] = useState("");
    const [className, setClassName] = useState("");
    const [teacherId, setTeacherId] = useState(null);
    const [selectedTestId, setSelectedTestId] = useState(null);
    const [selectedTest, setSelectedTest] = useState(null);
    const [filterName, setFilterName] = useState("");
    const [filterTime, setFilterTime] = useState("this"); // "this", "last", "next"


    // Lấy userId từ token
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setTeacherId(decoded.id || decoded._id);
            } catch (e) {
                setTeacherId(null);
            }
        }
    }, []);

    const handleCloseModal = () => {
        setShowCreateModal(false);
        setSelectedTest(null);
    };

    const fetchClassInfo = async () => {
        if (!classId) return;
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(API_ENDPOINTS.GET_CLASS_BY_ID(classId), {
                headers: { Authorization: `Bearer ${token}` }
            });

            const classData = res.data.data;
            setClassName(classData.className || "");
            setCourseName(classData.course?.name || "");
        } catch (error) {
            console.error("Error fetching class info", error);
            setClassName("");
            setCourseName("");
        }
    };


    // Lấy danh sách bài kiểm tra đã assign cho lớp
    const fetchAssigns = async () => {
        if (!classId) return;
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(API_ENDPOINTS.GET_TEST_ASSIGN_BY_CLASS(classId), {
                headers: { Authorization: `Bearer ${token}` }
            });
            const assigns = res.data.data || [];
            setAssignData(assigns);

            if (assigns.length > 0) {
                setCourseName(assigns[0].courseId?.nameCourses || "");
                setClassName(assigns[0].classId?.name);
            } else {
                setCourseName("");
                setClassName("");
            }
        } catch (err) {
            setAssignData([]);
            setCourseName("");
            setClassName("");
        }
    };

    useEffect(() => {
        fetchAssigns();
        fetchClassInfo();
    }, [classId]);

    const handleDownloadTemplate = () => {
        axios.get(API_ENDPOINTS.DOWNLOAD_XLSX_TEMPLATE, {
            responseType: 'blob',
        })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'test-template.xlsx');
                document.body.appendChild(link);
                link.click();
            })
            .catch((error) => {
                console.error('Error downloading template:', error);
            });
    };

    // Hàm xác định trạng thái bài kiểm tra
    const getStatus = (startDate, dueDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const due = new Date(dueDate);
        if (now < start) return { text: "Not started", color: "#dc2626" }; // đỏ
        if (now > due) return { text: "Ended", color: "#a16207" }; // nâu
        return { text: "In progress", color: "#16a34a" }; // xanh
    };

    const getTimeRange = () => {
        const now = new Date();
        const dayOfWeek = now.getDay(); // Sunday = 0
        const diffToMonday = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const monday = new Date(now.setDate(diffToMonday));
        monday.setHours(0, 0, 0, 0);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);

        return { monday, sunday };
    };


    const isInWeek = (dateStr, weekType) => {
        if (!dateStr) return false;
        const date = new Date(dateStr);
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0=Sunday
        const diffToMonday = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const monday = new Date(now.setDate(diffToMonday));
        monday.setHours(0, 0, 0, 0);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);

        let rangeStart = new Date(monday);
        let rangeEnd = new Date(sunday);

        if (weekType === "last") {
            rangeStart.setDate(rangeStart.getDate() - 7);
            rangeEnd.setDate(rangeEnd.getDate() - 7);
        } else if (weekType === "next") {
            rangeStart.setDate(rangeStart.getDate() + 7);
            rangeEnd.setDate(rangeEnd.getDate() + 7);
        }

        return date >= rangeStart && date <= rangeEnd;
    };


    return (
        <div className="min-h-screen flex flex-col bg-[#f5f9fc]">
            <div className="flex-1 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* <h2 className="font-bold text-3xl mb-8 text-[#111827]">Test Management </h2> */}
                    <div className="flex flex-col md:flex-row gap-6 mb-8 justify-center">
                        <div className="flex-1 flex justify-center">
                            <div className="bg-[#0a2540] text-white rounded-xl flex items-center justify-center h-[53px] w-[293px] font-semibold text-lg shadow">
                                Course: {courseName || "Chưa có tên khóa học"}
                            </div>
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="bg-[#0a2540] text-white rounded-xl flex items-center justify-center h-[53px] w-[293px] font-semibold text-lg shadow">
                                {className || "No class found"}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow p-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                            <span className="font-bold text-lg text-[#111827]">Test List</span>
                            <div className="flex-1 border-b-2 border-[#e0e7ef] mb-2 md:mb-0" />
                            <div className="flex flex-col md:flex-row gap-2 w-full max-w-2xl">
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={filterName}
                                    onChange={(e) => setFilterName(e.target.value)}
                                    className="rounded-full px-4 py-2 border border-[#e0e7ef] bg-white shadow w-full"
                                />


                            </div>

                            <button
                                className="flex items-center gap-2 bg-[#DFE9FF] text-[#111827] rounded-xl px-6 py-2 font-semibold shadow min-w-[150px]"
                                style={{borderRadius: "10px"}}
                                onClick={() => setShowCreateModal(true)}
                            >
                                <FontAwesomeIcon icon={faPlus} /> Create Test
                            </button>
                        </div>

                        <div className="flex gap-3 mb-4">
                            <select
                                value={filterTime}
                                onChange={(e) => setFilterTime(e.target.value)}
                                className="rounded-full px-4 py-2 border border-[#e0e7ef] bg-white shadow"
                            >
                                <option value="">-- All time --</option>
                                <option value="past">Past </option>
                                <option value="this">This week</option>
                                <option value="future">Future </option>
                            </select>
                            {/* <button
                                className="bg-[#DFE9FF] text-[#111827] rounded-lg px-6 py-2 font-semibold flex items-center gap-2 shadow"
                            >
                                <FontAwesomeIcon icon={faFileExport} /> Extract file
                            </button> */}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-[#f5f9fc] rounded-xl">
                                <thead>
                                    <tr className="border-b-2 border-[#e0e7ef]">
                                        <th className="py-2 px-4 text-left text-[#111827] font-semibold">No</th>
                                        <th className="py-2 px-4 text-left text-[#111827] font-semibold">Test name</th>
                                        <th className="py-2 px-4 text-left text-[#111827] font-semibold">Start</th>
                                        <th className="py-2 px-4 text-left text-[#111827] font-semibold">End</th>
                                        {/* <th className="py-2 px-4 text-left text-[#111827] font-semibold">Mô tả</th> */}
                                        <th className="py-2 px-4 text-left text-[#111827] font-semibold">Status</th>
                                        <th className="py-2 px-4 text-left text-[#111827] font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignData.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-6 text-gray-400">No test have assigned</td>
                                        </tr>
                                    ) : (
                                        assignData
                                            .filter((assign) => {
                                                const title = assign.testId?.title || assign.title || "";
                                                const matchName = title.toLowerCase().includes(filterName.toLowerCase());

                                                const { monday, sunday } = getTimeRange();
                                                const startDate = new Date(assign.startDate);

                                                let matchTime = true;
                                                if (filterTime === "this") {
                                                    matchTime = startDate >= monday && startDate <= sunday;
                                                } else if (filterTime === "past") {
                                                    matchTime = startDate < monday;
                                                } else if (filterTime === "future") {
                                                    matchTime = startDate > sunday;
                                                }

                                                return matchName && matchTime;
                                            })

                                            .map((assign, idx) => {
                                                const status = getStatus(assign.startDate, assign.dueDate);
                                                return (
                                                    <tr key={assign._id} className="border-b border-[#e0e7ef]">
                                                        <td className="py-2 px-4">{idx + 1}</td>
                                                        <td className="py-2 px-4 font-semibold">{assign.testId?.title || assign.title}</td>
                                                        <td className="py-2 px-4 font-bold">
                                                            {assign.startDate ? new Date(assign.startDate).toLocaleString("vi-VN") : ""}
                                                        </td>
                                                        <td className="py-2 px-4 font-bold">
                                                            {assign.dueDate ? new Date(assign.dueDate).toLocaleString("vi-VN") : ""}
                                                        </td>
                                                        {/* <td className="py-2 px-4">{assign.testId?.description || assign.description}</td> */}
                                                        <td className="py-2 px-4 font-semibold" style={{ color: status.color }}>
                                                            {status.text}
                                                        </td>
                                                        <td className="py-2 px-4">
                                                            <button className="p-1 me-2 text-indigo-600 hover:text-indigo-900">
                                                                <FontAwesomeIcon icon={faEdit} />
                                                            </button>
                                                            <button className="p-1 text-blue-600 hover:text-blue-900">
                                                                <FontAwesomeIcon icon={faFileExport} />
                                                            </button>
                                                            <button className="p-1 text-red-600 hover:text-red-900">
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Modals */}
                    <ChooseTestModal
                        show={showChooseModal}
                        onHide={() => setShowChooseModal(false)}
                        onBack={() => {
                            setShowChooseModal(false);
                            setShowCreateModal(true);
                        }}
                        courseId={courseId}
                        classId={classId}
                        onTestSelect={(test) => { // test is the full object
                            setSelectedTest(test);
                            setShowChooseModal(false);
                            setShowCreateModal(true);
                        }}
                    />

                    <AssignTestModal
                        show={showCreateModal}
                        onHide={handleCloseModal}
                        onSubmit={() => {
                            setShowCreateModal(false);
                            fetchAssigns();
                        }}
                        switchToChooseModal={() => {
                            setShowCreateModal(false);
                            setShowChooseModal(true);
                        }}
                        courseId={courseId}
                        classId={classId}
                        testId={selectedTest?.id}
                        teacherId={teacherId}
                        selectedTest={selectedTest} // pass the whole object
                    />
                </div>
            </div>
        </div>
    );
};

export default TestTab;