import React from "react";
import Modal from "react-bootstrap/Modal";
import Carousel from "react-bootstrap/Carousel";
import Button from "react-bootstrap/Button";

const guideSteps = [
    { step: 1, image: "/images/registercourse/1.png", description: "Click on the 'Register' button on the homepage." },
    { step: 2, image: "/images/registercourse/2.png", description: "Fill in your information." },
    { step: 3, image: "/images/registercourse/3.png", description: "Choose the course you want." },
    { step: 4, image: "/images/registercourse/4.png", description: "Click 'Enroll'." },
    { step: 5, image: "/images/registercourse/5.png", description: "Check the course information." },
    { step: 6, image: "/images/registercourse/6.png", description: "Check your information." },
    { step: 7, image: "/images/registercourse/7.png", description: "Start the course" }
];

export default function GuestViewCourseRegistration({ show, onClose }) {
    return (
        <Modal
            show={show}
            onHide={onClose}
            centered
            size="xl"
            dialogClassName="custom-modal-width"
        >
            <Modal.Header closeButton>
                <Modal.Title>Guide to register a course</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ minHeight: "650px" }}>
                <Carousel interval={null} indicators>
                    {guideSteps.map((step, index) => (
                        <Carousel.Item key={index}>
                            <div style={{ textAlign: "center", padding: "0 20px 40px" }}>
                                <h4 style={{ marginBottom: 20 }}>Step {step.step}</h4>
                                <img
                                    src={step.image}
                                    alt={`Step ${step.step}`}
                                    style={{ maxWidth: "100%", maxHeight: 450, marginBottom: 24 }}
                                />
                                <p style={{ marginTop: 8, fontSize: 16 }}>{step.description}</p>
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Close</Button>
            </Modal.Footer>

            <style>
                {`
          .custom-modal-width .modal-dialog {
            max-width: 1200px;
            width: 90vw;
          }

          /* === Mũi tên next/prev === */
          .carousel-control-next, .carousel-control-prev {
            width: 60px;
            height: 60px;
            top: 50%;
            transform: translateY(-50%);
            opacity: 1;
            z-index: 10;
          }
          .carousel-control-next-icon, .carousel-control-prev-icon {
            background-color: #999;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            background-size: 60% 60%;
            box-shadow: 0 2px 8px #0002;
          }

          /* === Indicators === */
          .carousel-indicators [data-bs-target] {
            background-color: #999 !important;
          }

          .carousel-indicators {
            bottom: 20px;
          }
        `}
            </style>
        </Modal>
    );
}
