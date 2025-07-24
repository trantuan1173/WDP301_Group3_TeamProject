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

const GuestViewFeedBack = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.GET_HIGHLIGHT_FEEDBACKS);
        if (response.data.success) {
          setFeedbackList(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
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
      <h2 className="text-3xl font-extrabold text-center mb-10 text-blue-800 drop-shadow-sm tracking-wide">
        💬 What Students Say About Our Courses
      </h2>

      <div className="max-w-6xl mx-auto px-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading feedback...</p>
        ) : feedbackList.length === 0 ? (
          <p className="text-center text-gray-500">No feedback available.</p>
        ) : (
          <Slider {...settings}>
            {feedbackList.map((fb) => {
              const studentName = fb.userId?.profileId?.name || "Anonymous";
              const studentInitial = studentName.charAt(0) || "A";
              const courseName = fb.courseId?.nameCourses || "N/A";

              return (
                <div key={fb._id} className="px-4">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-md hover:shadow-xl transition-all p-5 h-full flex flex-col justify-between border border-blue-300 min-h-[250px]">
                    {/* Avatar + Info */}
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow flex items-center justify-center text-lg font-bold text-white mr-3">
                        {studentInitial}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-blue-700">{studentName}</h3>
                        <p className="text-sm text-gray-500">Course: {courseName}</p>
                      </div>
                    </div>

                    {/* Feedback */}
                    <p className="text-blue-900 italic text-base mb-3 leading-relaxed line-clamp-4 overflow-hidden">"{fb.feedback}"</p>

                    {/* Rating */}
                    <div className="text-yellow-400 text-base">{renderStars(fb.rating)}</div>
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

export default GuestViewFeedBack;
