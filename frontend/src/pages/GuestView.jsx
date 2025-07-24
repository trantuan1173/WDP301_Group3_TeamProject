import { useRef, useState, useEffect } from "react";
import Navbar from "../components/Layouts/NavBar";
import Footer from "../components/Layouts/Footer";
import RouteCourse from "../components/Guest/RouteCourse";
import GuestViewTeacher from "../components/Guest/GuestViewTeacher";
import GuestViewFeedBack from "../components/Guest/GuestViewFeedBack";
import GuestGetAdive from "../components/Guest/GuestGetAdvise";
import { FaArrowUp } from "react-icons/fa";

export default function GuestView() {
  const supportRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToSupport = () => {
    if (supportRef.current) {
      supportRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="w-full">
        <Navbar />
      </header>

      <main className="w-full">
        <section className="w-full">
          <div className="w-full sm:px-6 lg:px-12 py-6">
            <RouteCourse onSupportClick={scrollToSupport} />
          </div>

          <div className="w-full">
            <GuestViewTeacher />
          </div>

          <div className="w-full">
            <GuestViewFeedBack />
          </div>

          <div className="w-full sm:px-6 lg:px-12 py-6" ref={supportRef}>
            <GuestGetAdive />
          </div>
        </section>
      </main>

      <Footer />

      {/* Nút scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 flex items-center justify-center bg-gray-600 text-white rounded-full shadow-lg hover:bg-gray-800 transition duration-300"
          aria-label="Scroll to top"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </>
  );
}
