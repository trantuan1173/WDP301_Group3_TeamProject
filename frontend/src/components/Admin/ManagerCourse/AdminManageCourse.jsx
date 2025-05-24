import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

import AdminAddCourse from "./AdminAddCourseForm";
import AdminEditCourse from "./AdminEditCourse";
import CourseDetailModal from "./CourseDetailModal";

import axios from "axios";
import { API_ENDPOINTS } from "../../../config";




export default function AdminManageCourse() {
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [courses, setCourses] = useState([]);
    const [viewingCourse, setViewingCourse] = useState(null);
    const [editingCourse, setEditingCourse] = useState(null);

    const handleAddCourse = (newCourse) => {
        setCourses([...courses, { ...newCourse, _id: Date.now().toString() }]);
    };
    const handleEditCourse = (updatedCourse) => {
        // Ví dụ: cập nhật lại state hoặc fetch lại danh sách
        fetchCourses();
        setEditingCourse(null);
    };

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(API_ENDPOINTS.GET_ALL_COURSE_DETAIL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setCourses(response.data.data || []);
                console.log("Courses fetched successfully:", response.data.data);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };


    useEffect(() => {
        fetchCourses();
    }, []);

    const filteredCourses = courses.filter((course) => {
        const name = course.courseId?.nameCourses || "";
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const groupedCourses = filteredCourses.reduce((acc, course) => {
        const category = course.courseId?.type || "Khác";
        if (!acc[category]) acc[category] = [];
        acc[category].push(course);
        return acc;
    }, {});

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-4">QUẢN LÝ KHOÁ HỌC</h2>

            {/* Search + Add */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center border rounded px-2 bg-white w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Tìm kiếm khoá học..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="outline-none py-1 px-2 bg-transparent w-full"
                    />
                    <FiSearch className="text-gray-600" />
                </div>
                <button
                    onClick={() => setShowAddPopup(true)}
                    className="bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded shadow text-sm font-medium"
                >
                    <FaPlus /> Thêm khoá học
                </button>
            </div>

            {/* Grouped Course Sections */}
            {Object.entries(groupedCourses).map(([category, courseList]) => (
                <div key={category} className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">{category}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {courseList.map((course) => (
                            <div
                                key={course._id}
                                className="bg-white rounded-lg shadow p-4 text-center"
                            >
                                <img
                                    src={course.imageURL}
                                    alt="course"
                                    className="w-full h-48 object-cover rounded"
                                />
                                <h4 className="font-semibold text-base mt-2 mb-1">
                                    {course.courseId?.nameCourses}
                                </h4>
                                <p className="text-sm text-gray-600">Level: {course.level}</p>
                                <p className="text-sm text-gray-600">
                                    Thời lượng: {course.durationDays} buổi
                                </p>
                                <p className="text-sm text-gray-600">
                                    Học phí: {course.price?.toLocaleString()} VNĐ
                                </p>

                                <button
                                    className="mt-2 bg-indigo-600 text-white text-sm px-3 py-1 rounded"
                                    onClick={() => setViewingCourse(course)}
                                >
                                    Chi tiết
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Modals */}
            {showAddPopup && (
                <AdminAddCourse
                    onClose={() => setShowAddPopup(false)}
                    onSubmit={fetchCourses}
                />
            )}
            {viewingCourse && (
                <CourseDetailModal
                    courseData={viewingCourse}
                    onClose={() => setViewingCourse(null)}
                    onEdit={() => {
                        setEditingCourse(viewingCourse);
                        setViewingCourse(null);
                    }}
                    onDelete={fetchCourses}



                />
            )}
            {editingCourse && (
                <AdminEditCourse
                    courseData={editingCourse}
                    onClose={() => setEditingCourse(null)}
                    handlerEdit={handleEditCourse} // truyền thêm prop này
                    onRefresh={fetchCourses}
                />
            )}

        </div>
    );
}
