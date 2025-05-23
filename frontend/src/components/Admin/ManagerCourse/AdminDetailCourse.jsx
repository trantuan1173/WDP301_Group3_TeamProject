import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDetailCourse() {
    const { id } = useParams(); // Đây là courseId cần lọc
    const [courseDetails, setCourseDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAllCourseDetails = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get(
                    `http://localhost:9999/api/course-details`, // gọi GET_ALL_COURSE_DETAIL
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Lọc ra những detail thuộc courseId === id trong params
                const filteredDetails = res.data.filter(
                    (detail) => detail.courseId?._id === id
                );

                setCourseDetails(filteredDetails);
            } catch (err) {
                console.error("Lỗi khi lấy chi tiết khóa học:", err);
                setError("Không thể tải dữ liệu chi tiết khoá học.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllCourseDetails();
    }, [id]);

    if (loading) return <div className="p-6">Đang tải dữ liệu...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-6">Chi tiết các khoá học</h2>

            {courseDetails.length === 0 ? (
                <p>Không có chi tiết nào cho khoá học này.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courseDetails.map((detail) => (
                        <div
                            key={detail._id}
                            className="bg-white rounded shadow p-6 transition hover:shadow-lg"
                        >
                            <img
                                src={detail.imageURL}
                                alt="Course"
                                className="w-full h-40 object-cover rounded mb-4"
                            />
                            <h3 className="text-xl font-semibold mb-2">
                                {detail.courseId?.nameCourses || "Tên khóa học không xác định"}
                            </h3>
                            <p><strong>Trình độ:</strong> {detail.level}</p>
                            <p><strong>Thời lượng:</strong> {detail.durationDays} buổi</p>
                            <p><strong>Học phí:</strong> {detail.price.toLocaleString()} VNĐ</p>
                            <p><strong>Mô tả:</strong> {detail.description || "Không có mô tả."}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
