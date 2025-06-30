import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Hàm render sao
const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
      ★
    </span>
  ));
};

const GuestViewTeacher = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(
          API_ENDPOINTS.GET_HIGHLIGHT_TEACHER_FEEDBACKS
        );
        if (response.data.success) {
          setFeedbackList(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching teacher feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="bg-blue-50 py-12">
      <h2 className="text-2xl font-bold text-center mb-10 text-blue-800">
        ⭐ Outstanding Teacher Feedback ⭐
      </h2>

      <div className="max-w-6xl mx-auto px-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading feedback...</p>
        ) : feedbackList.length === 0 ? (
          <p className="text-center text-gray-500">No feedback available.</p>
        ) : (
          <Slider {...settings}>
            {feedbackList.map((fb) => {
              const teacherName = fb.teacherId?.profileId?.name || "Anonymous";
              const teacherInitial = teacherName.charAt(0) || "T";

              return (
                <div key={fb._id} className="px-2">
                  {" "}
                  {/* Giảm padding giữa các slide */}
                  <div className="bg-blue-100 rounded-lg shadow-lg p-4 h-full flex flex-col justify-between border border-blue-300">
                    {/* Avatar + Info */}
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-lg font-semibold text-white mr-3">
                        {teacherInitial}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-blue-800">
                          {teacherName}
                        </h3>
                        <p className="text-xs text-blue-600">
                          {fb.teacherId?.email}
                        </p>
                      </div>
                    </div>

                    {/* Feedback */}
                    <p className="text-blue-900 italic text-lg mb-3 leading-snug">
                      "{fb.feedback}"
                    </p>

                    {/* Rating */}
                    <div className="text-yellow-400 text-base">
                      {renderStars(fb.rating)}
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        )}
      </div>
    </section>
  );
};

export default GuestViewTeacher;
