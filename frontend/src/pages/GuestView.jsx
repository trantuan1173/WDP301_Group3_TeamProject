import { useRef } from "react";
import Navbar from "../components/Layouts/NavBar";
import Footer from "../components/Layouts/Footer";
import RouteCourse from "../components/Guest/RouteCourse";
import GuestViewTeacher from "../components/Guest/GuestViewTeacher";
import GuestViewFeedBack from "../components/Guest/GuestViewFeedBack";
import GuestGetAdive from "../components/Guest/GuestGetAdvise";

export default function GuestView() {
  const supportRef = useRef(null);

  const scrollToSupport = () => {
    if (supportRef.current) {
      supportRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <>
      <header className="w-full">
        <Navbar />
      </header>
      
      <main className="w-full">
        <section className="w-full sm:px-6 lg:px-12 py-6">
          <div className="w-full">
            <RouteCourse onSupportClick={scrollToSupport} />
          </div>
          
          <div className="w-full mt-12">
            <GuestViewTeacher />
          </div>
          
          <div className="w-full mt-12">
            <GuestViewFeedBack />
          </div>
          
          <div className="w-full mt-12" ref={supportRef}>
            <GuestGetAdive />
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}