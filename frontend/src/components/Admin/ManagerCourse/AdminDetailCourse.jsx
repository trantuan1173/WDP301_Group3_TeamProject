import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDetailCourse() {
    const { id } = useParams();
    const [courseDetail, setCourseDetail] = useState(null);
    const [courseName, setCourseName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const token = localStorage.getItem("token");
                const detailRes = await axios.get(`http://localhost:9999/api/course-details/course/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (detailRes.data.length > 0) {
                    const detail = detailRes.data[0]; // Nếu có nhiều, lấy cái đầu
                    setCourseDetail(detail);

                    // Lấy tên khoá học
                    const courseRes = await axios.get(`http://localhost:9999/api/courses/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setCourseName(courseRes.data.nameCourses);
                }
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết khóa học:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    if (loading) return <div className="p-6">Đang tải dữ liệu...</div>;
    if (!courseDetail) return <div className="p-6">Không tìm thấy chi tiết khóa học</div>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Chi tiết khoá học</h2>
            <div className="bg-white rounded shadow p-6 max-w-xl">
                <h3 className="text-xl font-semibold mb-2">{courseName}</h3>
                <p><strong>Trình độ:</strong> {courseDetail.level}</p>
                <p><strong>Thời lượng:</strong> {courseDetail.durationDays} buổi</p>
                <p><strong>Học phí:</strong> {courseDetail.price.toLocaleString()} VNĐ</p>
                <p><strong>Mô tả:</strong> {courseDetail.description || "Không có mô tả."}</p>
            </div>
        </div>
    );
}
