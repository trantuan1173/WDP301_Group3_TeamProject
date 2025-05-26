import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';

const GuestViewFeedBack = () => {
  const [feedbackImages, setFeedbackImages] = useState([]);

  // Mock API gọi dữ liệu feedback
  useEffect(() => {
    setTimeout(() => {
      const mockData = [
        { id: 1, image: '/images/feedback1.jpg' },
        { id: 2, image: '/images/feedback2.jpg' },
        { id: 3, image: '/images/feedback3.jpg' },
        { id: 4, image: '/images/feedback4.jpg' },
        { id: 5, image: '/images/feedback5.jpg' },
        { id: 6, image: '/images/feedback6.jpg' },
      ];
      setFeedbackImages(mockData);
    }, 1000); // Giả lập delay API 1 giây
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="bg-white py-10 px-4 text-center">
      <h2 className="text-xl font-bold mb-6">STUDENT FEEDBACK</h2>
      {feedbackImages.length === 0 ? (
        <p>Loading feedback...</p>
      ) : (
        <Slider {...settings}>
          {feedbackImages.map((fb) => (
            <div key={fb.id} className="px-2">
              <div className="bg-gray-300 h-[240px] w-[240px] rounded overflow-hidden mx-auto">
                <img
                  src={fb.image}
                  alt={`Feedback ${fb.id}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </Slider>
      )}
    </section>
  );
};

export default GuestViewFeedBack;
