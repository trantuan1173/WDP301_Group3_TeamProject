import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function GuestViewTeacher() {
  const [teachers, setTeachers] = useState([]);

  
  useEffect(() => {
    
    setTimeout(() => {
      const mockData = [
        { id: 1, name: "Teacher 1", image: "/images/teacher1.jpg" },
        { id: 2, name: "Teacher 2", image: "/images/teacher2.jpg" },
        { id: 3, name: "Teacher 3", image: "/images/teacher3.jpg" },
        { id: 4, name: "Teacher 4", image: "/images/teacher4.jpg" },
        { id: 5, name: "Teacher 5", image: "/images/teacher5.jpg" },
      ];
      setTeachers(mockData);
    }, 1000); 
  }, []);

  return (
    <div className="w-full bg-blue-100 py-10">
      <h2 className="text-2xl font-bold text-center mb-6">
        100% GIÁO VIÊN ĐẠT 950+ TOEIC QUỐC TẾ
      </h2>

      <div className="max-w-7xl mx-auto px-4">
        {teachers.length === 0 ? (
          <p className="text-center">Đang tải danh sách giáo viên...</p>
        ) : (
          <Swiper
            spaceBetween={20}
            slidesPerView={3}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {teachers.map((teacher) => (
              <SwiperSlide key={teacher.id}>
                <div className="flex flex-col items-center bg-white rounded-xl shadow-md p-4">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-48 h-48 object-cover rounded-lg mb-2"
                  />
                  <p className="text-center font-medium">{teacher.name}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}
