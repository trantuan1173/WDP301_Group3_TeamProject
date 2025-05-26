import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from '../../config';
import { Container, Row, Col, Card, Button, Carousel } from "react-bootstrap";
import '../../assets/CSS/MinhKhanhCSS.css';
import DraggableCarousel from "../../components/ulti/DraggableCarousel";
import Navbar from "../../components/Layouts/NavBar";
import Footer from "../../components/Layouts/Footer";
import RouteCourse from "../../components/Guest/RouteCourse";

export default function GuestView() {
    const [toeicCourses, setToeicCourses] = useState([]);
    const [ieltsCourses, setIeltsCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get(API_ENDPOINTS.GET_COURSES);
                const data = res.data.data;

                const toeic = data.filter(course => course.type === "toeic");
                const ielts = data.filter(course => course.type === "ielts");

                setToeicCourses(toeic);
                setIeltsCourses(ielts);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            }
        };

        fetchCourses();
    }, []);



    return (
        <>
            <header className="guest-header">
                <Navbar />
            </header>
            

            <main>
                <section className="guest-section1">
                    <Container>
                       
                        <RouteCourse />
                       
                    </Container>
                </section>
                

                

            </main>
            <Footer />
        </>
    );
}
{/* <section className="guest-section3">
                    <Container>

                        <div className="guest-section3-title">
                            100% GIÁO VIÊN ĐẠT 950+ TOEIC QUỐC TẾ
                        </div>
                        <div className="guest-section3-teacher-display-container">
                            <div className="guest-section3-card-row">
                                <div className="guest-section3-card"></div>
                                <div className="guest-section3-card"></div>
                                <div className="guest-section3-card"></div>
                            </div>

                        </div>
                    </Container>
                </section>

                <section className="guest-section4">
                    <Container>
                        <div className="guest-section4-title">CẢM NHẬN CỦA HỌC VIÊN</div>
                        <DraggableCarousel>
                            <div className="guest-section4-feedback-card">Feedback 1</div>
                            <div className="guest-section4-feedback-card">Feedback 2</div>
                            <div className="guest-section4-feedback-card">Feedback 3</div>
                            <div className="guest-section4-feedback-card">Feedback 4</div>
                            <div className="guest-section4-feedback-card">Feedback 5</div>
                        </DraggableCarousel>
                    </Container>
                </section> */}