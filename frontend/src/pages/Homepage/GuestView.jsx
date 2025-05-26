import Navbar from "../../components/Layouts/NavBar";
import Footer from "../../components/Layouts/Footer";
import RouteCourse from "../../components/Guest/RouteCourse";
import GuestViewTeacher from "../../components/Guest/GuestViewTeacher";
import GuestViewFeedBack from "../../components/Guest/GuestViewFeedBack";

export default function GuestView() {
  return (
    <>
      <header className="w-full">
        <Navbar />
      </header>

      <main className="w-full">
        <section className="w-full px-4 sm:px-6 lg:px-12 py-6">
          <div className="w-full">
            <RouteCourse />
          </div>

          <div className="w-full mt-12">
            <GuestViewTeacher />
          </div>

          <div className="w-full mt-12">
            <GuestViewFeedBack />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
