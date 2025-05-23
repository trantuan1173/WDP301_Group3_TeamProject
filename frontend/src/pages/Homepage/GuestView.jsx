import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from '../../config';
import { Container, Row, Col, Card, Button, Carousel } from "react-bootstrap";
import '../../assets/CSS/MinhKhanhCSS.css';
import DraggableCarousel from "../../components/ulti/DraggableCarousel";
import Navbar from "../../components/Layouts/NavBar";
import Footer from "../../components/Layouts/Footer";

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
                        <h2 className="roadmap-main-title">TOEIC</h2>
                        <Row>
                            {/* Left side - Roadmap */}
                            <Col md={5}>
                                <div className="roadmap-container">
                                    {/* Block 1 - Roadmap Title */}
                                    <Card className="roadmap-card-guest">
                                        <Card.Body className="roadmap-card-container-At-GuestView">
                                            <div className="roadmap-content-card-main-title-At-GuestView">
                                                TOEIC Roadmap
                                            </div>
                                        </Card.Body>
                                    </Card>

                                    {/* Block 1 - Mất gốc */}
                                    <Card className="roadmap-card-guest">
                                        <Card.Body className="roadmap-card-container-At-GuestView">
                                            <div className="roadmap-content-stack-At-GuestView">
                                                <Card.Title>Từ Mất gốc - 450+</Card.Title>
                                                <Card.Text className="desc">
                                                    Cải thiện khả năng từ mất gốc đến 450+/990 TOEIC
                                                </Card.Text>
                                                <div className="roadmap-btn-stack-At-GuestView">
                                                    <button className="roadmap-btn-At-GuestView">
                                                        <div className="roadmap-btn-title-At-GuestView">TOEIC Foundation</div>
                                                        <div className="roadmap-btn-desc-At-GuestView">Xây nền</div>
                                                    </button>
                                                    <button className="roadmap-btn-At-GuestView">
                                                        <div className="roadmap-btn-title-At-GuestView">TOEIC Beginner</div>
                                                        <div className="roadmap-btn-desc-At-GuestView">350+/990 TOEIC</div>
                                                    </button>
                                                    <button className="roadmap-btn-At-GuestView">
                                                        <div className="roadmap-btn-title-At-GuestView">TOEIC Beginner</div>
                                                        <div className="roadmap-btn-desc-At-GuestView">450+/990 TOEIC</div>
                                                    </button>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>

                                    {/* Block 2 */}
                                    <Card className="roadmap-card-guest">
                                        <Card.Body className="roadmap-card-container-At-GuestView">
                                            <div className="roadmap-content-stack-At-GuestView">
                                                <Card.Title>TỪ 450 - 700+ TOEIC</Card.Title>
                                                <Card.Text className="desc">
                                                    Chiến lược học tập tối ưu, luyện nghe chuyên sâu. Phát triển toàn diện kỹ năng Listening & Reading. Cam kết đạt mục tiêu, sẵn sàng cho TOEIC cấp độ cao.
                                                </Card.Text>
                                                <div className="roadmap-btn-stack-At-GuestView">
                                                    <button className="roadmap-btn-At-GuestView">
                                                        <div className="roadmap-btn-title-At-GuestView">TOEIC Pre-Intermediate</div>
                                                        <div className="roadmap-btn-desc-At-GuestView">450+/990 TOEIC</div>
                                                    </button>
                                                    <button className="roadmap-btn-At-GuestView">
                                                        <div className="roadmap-btn-title-At-GuestView">TOEIC Intermediate</div>
                                                        <div className="roadmap-btn-desc-At-GuestView">550+/990 TOEIC</div>
                                                    </button>
                                                    <button className="roadmap-btn-At-GuestView">
                                                        <div className="roadmap-btn-title-At-GuestView">TOEIC Advanced</div>
                                                        <div className="roadmap-btn-desc-At-GuestView">700+/990 TOEIC</div>
                                                    </button>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>

                                    {/* Block 3 */}
                                    <Card className="roadmap-card-guest">
                                        <Card.Body className="roadmap-card-container-At-GuestView">
                                            <div className="roadmap-content-stack-At-GuestView">
                                                <Card.Title>4 KỸ NĂNG</Card.Title>
                                                <Card.Text className="desc">
                                                    Lộ trình phát triển toàn diện 4 KỸ NĂNG Listening - Reading - Speaking - Writing trong vòng 10 - 11 tháng. Giáo trình chuyên sâu, phương pháp hiệu quả. Từ mất gốc đến thành thạo, sẵn sàng cho mọi thử thách TOEIC.
                                                </Card.Text>
                                                <div className="roadmap-btn-stack-At-GuestView">
                                                    <button className="roadmap-btn-At-GuestView">
                                                        <div className="roadmap-btn-title-At-GuestView">TOEIC Beginner</div>
                                                        <div className="roadmap-btn-desc-At-GuestView">350+/990 TOEIC</div>
                                                    </button>
                                                    <button className="roadmap-btn-At-GuestView">
                                                        <div className="roadmap-btn-title-At-GuestView">TOEIC Pre-Intermediate</div>
                                                        <div className="roadmap-btn-desc-At-GuestView">450+/990 TOEIC</div>
                                                    </button>
                                                    <button className="roadmap-btn-At-GuestView">
                                                        <div className="roadmap-btn-title-At-GuestView">TOEIC Intermediate</div>
                                                        <div className="roadmap-btn-desc-At-GuestView">550+/990 TOEIC</div>
                                                    </button>
                                                    <button className="roadmap-btn-At-GuestView">
                                                        <div className="roadmap-btn-title-At-GuestView">TOEIC Advanced</div>
                                                        <div className="roadmap-btn-desc-At-GuestView">700+/990 TOEIC</div>
                                                    </button>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </Col>

                            {/* Right side - Courses */}
                            <Col md={7}>
                                <Row xs={1} md={2} className="g-3">
                                    {toeicCourses.map((course, i) => (
                                        <Col key={i}>
                                            <Card className="custom-course-card">
                                                <Card.Img variant="top" src={course.imageURL} className="course-img" />
                                                <Card.Body>
                                                    <Card.Title>{course.nameCourses}</Card.Title>
                                                    <Card.Text className="small mb-2">
                                                        Thời lượng: {course.durationDays} buổi
                                                    </Card.Text>
                                                    <button className="custom-center-btn">Tìm hiểu thêm</button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}

                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </section>
                <div className="section-divider"></div>
                <section className="guest-section2">
                    <Container>
                        <h2 className="roadmap-main-title">IELTS</h2>
                        <Row>
                            {/* Left side - Roadmap */}
                            <Col md={5}>
                                <div className="roadmap-container">
                                    {/* Block 1 - Roadmap Title */}
                                    <Card className="roadmap-card-guest">
                                        <Card.Body className="roadmap-card-container-At-GuestView">
                                            <div className="roadmap-content-card-main-title-At-GuestView">
                                                IELTS Roadmap
                                            </div>
                                        </Card.Body>
                                    </Card>

                                    {/* Block 1 - Mất gốc */}
                                    <Card className="roadmap-card-guest">
                                        <Card.Body className="roadmap-card-container-At-GuestView">
                                            <div className="roadmap-content-stack-At-GuestView">
                                                <Card.Title>Từ Mất gốc - 3.0</Card.Title>
                                                <Card.Text className="desc">
                                                    Cải thiện khả năng từ mất gốc đến 3.0/9.0
                                                </Card.Text>
                                                <div className="roadmap-btn-stack-At-GuestView">
                                                    <button className="roadmap-btn-At-GuestView">
                                                        <div className="roadmap-btn-title-At-GuestView">IELTS Foundation</div>
                                                        <div className="roadmap-btn-desc-At-GuestView">-3.0/9.0</div>
                                                    </button>
                                                    <button className="roadmap-btn-At-GuestView">
                                                        <div className="roadmap-btn-title-At-GuestView">IELTS Beginner</div>
                                                        <div className="roadmap-btn-desc-At-GuestView">3.5-4.0/9.0</div>
                                                    </button>
                                                    <button className="roadmap-btn-At-GuestView">
                                                        <div className="roadmap-btn-title-At-GuestView">IELTS Beginner</div>
                                                        <div className="roadmap-btn-desc-At-GuestView">4.5-5.0/9.0</div>
                                                    </button>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>

                                    {/* Block 2 */}
                                    <Card className="roadmap-card-guest">
                                        <Card.Body className="roadmap-card-container-At-GuestView">
                                            <div className="roadmap-content-stack-At-GuestView">
                                                <Card.Title>TỪ 5.0 - 7.5+ IELS</Card.Title>
                                                <Card.Text className="desc">
                                                    Chiến lược học tập tối ưu, luyện nghe chuyên sâu. Phát triển toàn diện kỹ năng Listening & Reading. Cam kết đạt mục tiêu, sẵn sàng cho TOEIC cấp độ cao.
                                                </Card.Text>
                                                <div className="roadmap-btn-stack-At-GuestView">
                                                    <button className="roadmap-btn-At-GuestView">
                                                        <div className="roadmap-btn-title-At-GuestView">IELTS Intermediate</div>
                                                        <div className="roadmap-btn-desc-At-GuestView">5.5-6.0</div>
                                                    </button>
                                                    <button className="roadmap-btn-At-GuestView">
                                                        <div className="roadmap-btn-title-At-GuestView">IELTS Upper</div>
                                                        <div className="roadmap-btn-desc-At-GuestView">6.5-7.0</div>
                                                    </button>
                                                    <button className="roadmap-btn-At-GuestView">
                                                        <div className="roadmap-btn-title-At-GuestView">IELTS Advanced</div>
                                                        <div className="roadmap-btn-desc-At-GuestView">7.5-8.0+</div>
                                                    </button>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>


                                </div>
                            </Col>

                            {/* Right side - Courses */}
                            <Col md={7}>
                                <Row xs={1} md={2} className="g-3">
                                    {ieltsCourses.map((course, i) => (
                                        <Col key={i}>
                                            <Card className="custom-course-card">
                                                <Card.Img variant="top" src={course.imageURL} className="course-img" />
                                                <Card.Body>
                                                    <Card.Title>{course.nameCourses}</Card.Title>
                                                    <Card.Text className="small mb-2">
                                                        Thời lượng: {course.durationDays} buổi
                                                    </Card.Text>
                                                    <button className="custom-center-btn">Tìm hiểu thêm</button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </section>

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

            </main>
            <Footer />
        </>
    );
}
