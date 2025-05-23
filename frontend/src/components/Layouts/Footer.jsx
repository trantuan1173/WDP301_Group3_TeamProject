import { Container, Row, Col, Card, Button, Carousel } from "react-bootstrap";
import '../../assets/CSS/MinhKhanhCSS.css';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone, faEnvelope, faPrint } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
    return (
        <div className="" style={{ marginTop: "200px" }}>
            <footer className="text-center text-lg-start text-white" style={{ backgroundColor: "#092257" }}>
                <section className="d-flex justify-content-between p-4" style={{ backgroundColor: "#8b9dc3" }}>
                  
                </section>

                <section>
                    <div className="container text-center text-md-start mt-5">
                        <div className="row mt-3">
                            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                                <h6 className="text-uppercase fw-bold">Smart English Center</h6>
                                <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: "60px", backgroundColor: "#7c4dff", height: "2px" }} />
                                <img src="./images/logo.png" alt="logo" className="footer-logo" />


                            </div>

                            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                                <h6 className="text-uppercase fw-bold">Khóa Học</h6>
                                <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: "60px", backgroundColor: "#7c4dff", height: "2px" }} />
                                <p><a href="#!" className="text-white">KHOÁ HỌC TOEIC</a></p>
                                <p><a href="#!" className="text-white">KHÓA HỌC IELTS</a></p>
                                <p><a href="#!" className="text-white">Quy trình đăng ký học</a></p>
                                <p><a href="#!" className="text-white">Nội quy lớp học</a></p>
                            </div>


                            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                                <h6 className="text-uppercase fw-bold">Thông tin liên hệ</h6>
                                <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: "60px", backgroundColor: "#7c4dff", height: "2px" }} />
                                <p><FontAwesomeIcon icon={faLocationDot} className="me-2" /> Trường Đại Học FPT, Hà Nội</p>
                                <p><FontAwesomeIcon icon={faEnvelope} className="me-2" /> mailenglishcenter@gmail.com</p>
                                <p><FontAwesomeIcon icon={faPhone} className="me-2" /> + 01 234 567 88</p>
                                <p><FontAwesomeIcon icon={faPrint} className="me-2" /> + 01 234 567 89</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
                    © 2025 Copyright: Smart English Center
                </div>
            </footer>
        </div>
    );
}
