import NavBar from "../Layouts/NavBar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";
import { useParams } from "react-router-dom";

export default function UserEnrollCourse() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [courseDetailData, setCourseDetailData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_ENDPOINTS.GET_COURSE(courseId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourseDetailData(res.data.data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <NavBar />
      <div className="p-6 bg-[#F1F6FA] min-h-screen">

        <div className="container">
          <button
            className="border-2 border-[#120E7D] text-[#120E7D] font-medium px-4 py-1 rounded mb-6"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <h1 className="text-3xl font-bold text-[#2d1ca0] mb-6">MY ORDER</h1>

          <div className="flex flex-col lg:flex-row gap-8">

            <div className="bg-white p-6 rounded-xl shadow-md w-full lg:w-3/4">
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-gray-500 text-sm">
                    <th>Courses</th>
                    <th>Courses Name</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gray-50 rounded-lg">
                    <td>
                      <img
                        src={courseDetailData?.details?.imageURL}
                        alt="Course Thumbnail"
                        className="w-20 h-20 object-cover rounded"
                      />
                    </td>
                    <td className="font-semibold">
                      {courseDetailData?.nameCourses}
                    </td>
                    <td className="font-bold text-gray-800">
                      {courseDetailData?.details?.price?.toLocaleString()} VND
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary Section */}
            <div className="bg-white p-6 rounded-xl shadow-md w-full lg:w-1/4">
              <h2 className="text-xl font-semibold text-gray-600 mb-4">Course Info</h2>
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  <strong>Category:</strong> {courseDetailData?.details?.type}
                </p>
                <p>
                  <strong>Level:</strong> {courseDetailData?.details?.level}
                </p>
                <p>
                  <strong>Duration:</strong> {courseDetailData?.details?.durationDays} days
                </p>
                <p>
                  <strong>Price:</strong> {courseDetailData?.details?.price?.toLocaleString()} VND
                </p>
              </div>
              <button
                onClick={() => navigate(`/payment-process`, { state: courseDetailData })}
                className="mt-6 w-full bg-[#2d1ca0] text-white font-semibold py-2 rounded hover:bg-[#1e1280] transition">
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}