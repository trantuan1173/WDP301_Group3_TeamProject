import { Container, Row, Col, Card, Button, Carousel } from "react-bootstrap";
import '../../assets/CSS/MinhKhanhCSS.css';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faInstagram, faPinterestP } from "@fortawesome/free-brands-svg-icons";
import { faLocationDot, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";


export default function Footer() {


    return (
        <footer id="footerHomePage">
            <div id="footerComunicateWarper">

                <Row style={{ backgroundColor: "#1B181F", borderBottom: "0.3px solid #fff", width: "100%" }}>
                    <Col sm={4} className="iconAndTextAtFooter">
                        <div className="iconTextContainer">
                            <div className="iconWrapper">
                                <FontAwesomeIcon icon={faLocationDot} />
                            </div>
                            <div className="textWrapper">
                                <div className="footerLabel">Address:</div>
                                <div className="footerContent">Thach That, Ha Noi</div>
                            </div>
                        </div>
                    </Col>
                    <Col sm={4} className="iconAndTextAtFooter">
                        <div className="iconTextContainer">
                            <div className="iconWrapper">
                                <FontAwesomeIcon icon={faPhone} />
                            </div>
                            <div className="textWrapper">
                                <div className="footerLabel">Phone:</div>
                                <div className="footerContent">097 379 28 81</div>
                            </div>
                        </div>
                    </Col>
                    <Col sm={4} className="iconAndTextAtFooter">
                        <div className="iconTextContainer">
                            <div className="iconWrapper">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </div>
                            <div className="textWrapper">
                                <div className="footerLabel">Email:</div>
                                <div className="footerContent">smartenglishcenter2025@gmail.com</div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            <Row style={{ backgroundColor: "#1B181F", padding: "40px 0", width: "100%" }}>
                {/* Logo and Social Icons */}
                <Col sm={3} className="footerSection">
                    <img src="./resourses/icons/logo3.png" alt="logo" id="footerLogo" />
                    <p id="footerDescription">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quae.
                    </p>
                    <div className="socialIcons">
                        <FontAwesomeIcon icon={faFacebookF} className="socialIcon" />
                        <FontAwesomeIcon icon={faInstagram} className="socialIcon" />
                    </div>
                </Col>

                {/* Services */}
                <Col sm={3} className="footerSection">
                    <h5 id="secondFooterTitle">Our Services:</h5>
                    <ul className="footerList">
                        <li><Link className="custom-link" to="/view-classes">My classes</Link></li>
                        <li>For You</li>
                        <li>Policies</li>
                        <li><Link className="custom-link" to="/list-all-posts">Newsfeed</Link></li>
                    </ul>
                </Col>

                {/* Gallery */}
                <Col sm={3} className="footerSection">
                    <h5 id="secondFooterTitle">Mentoring Program</h5>
                    <ul className="footerList">
                        <li><Link className="custom-link" to="/list-all-mentors">List Mentor</Link></li>
                        <li>Category</li>
                        <li>Major</li>
                        <a className="custom-link" href="https://docs.google.com/forms/d/e/1FAIpQLScU367jljT2dd-L-o67oVpFB_WDPp8wzvL-kFSepmbVCxw5_A/viewform"><li>Register mentor</li></a>
                    </ul>
                </Col>

                {/* Subscribe */}
                <Col sm={3} className="footerSection">
                    <h5>Đăng ký với chúng tôi</h5>
                    <a className="custom-link" href="https://docs.google.com/forms/d/e/1FAIpQLScU367jljT2dd-L-o67oVpFB_WDPp8wzvL-kFSepmbVCxw5_A/viewform"><button id="registerButtonAtFooter">Đăng ký</button></a>
                </Col>
            </Row>


            <Row id="copyrightAtFooterWrapper" >
                <div style={{ textAlign: "center" }}>
                    Copyright © 2025 <span style={{ color: "#FC6441" }}>Smart English Center</span> || All rights reserved.
                </div>

            </Row>

        </footer>
    )
};