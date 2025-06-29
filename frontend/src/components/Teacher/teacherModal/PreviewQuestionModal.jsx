// frontend/src/components/Teacher/teacherModal/PreviewQuestionModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { API_ENDPOINTS } from "../../../config";
import axios from "axios";
import "../../../assets/CSS/MinhKhanhCSS.css";

const PreviewQuestionModal = ({ show, onHide, test }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show && test?.id) {
            setLoading(true);
            const token = localStorage.getItem("token");
            axios.get(API_ENDPOINTS.GET_TEST_QUESTION_BY_ID(test.id), {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setQuestions(res.data.data.questions || []))
                .catch(() => setQuestions([]))
                .finally(() => setLoading(false));
        }
    }, [show, test]);

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Xem trước đề: {test?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{
                maxHeight: 400, // or any value you prefer, e.g. 350, 500
                overflowY: "auto"
            }}
            >
                {loading ? (
                    <div>Đang tải câu hỏi...</div>
                ) : questions.length === 0 ? (
                    <div>Không có câu hỏi nào.</div>
                ) : (
                    <ol>
                        {questions.map((q, idx) => (
                            <li key={idx} style={{ marginBottom: 16 }}>
                                <div><b>{q.question}</b></div>
                                <ul>
                                    {q.options.map((opt, i) => (
                                        <li key={i}>{opt}</li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ol>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Đóng</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PreviewQuestionModal;