// frontend/src/components/Student/UserDoingTest.jsx
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { API_ENDPOINTS } from "../../config";
import axios from "axios";

const TOTAL_QUESTIONS = 20;
const CORRECT_QUESTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 20];
const WRONG_QUESTIONS = [13, 19];

const QUESTION = [
    {
        id: 1,
        title: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        answer: "Paris"
    },
    {
        id: 2,
        title: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        answer: "4"
    }
    // You can add more mock questions here
];

const getStatus = (index, current) => {
    if (index === current) return "current";
    if (WRONG_QUESTIONS.includes(index)) return "wrong";
    if (CORRECT_QUESTIONS.includes(index)) return "correct";
    return "neutral";
};

const getColorStyle = (status) => {
    switch (status) {
        case "correct": return { bg: "#388e3c", color: "#fff" };
        case "wrong": return { bg: "#f44336", color: "#fff" };
        case "current": return { bg: "#ff5252", color: "#fff", border: "0 0 0 2px #222" };
        default: return { bg: "#e0e0e0", color: "#222" };
    }
};

export const UserDoingTest = () => {
    const [current, setCurrent] = useState(1);
    const [userId, setUserId] = useState(null);
    const [answers, setAnswers] = useState({});

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserId(decoded.id || decoded._id);
            } catch (e) {
                setUserId(null);
            }
        }
    }, []);

    const handleNav = (direction) => {
        setCurrent((prev) => {
            if (direction === "prev") return Math.max(1, prev - 1);
            if (direction === "next") return Math.min(TOTAL_QUESTIONS, prev + 1);
            return prev;
        });
    };

    const handleAnswer = (questionIndex, selectedAnswer) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: selectedAnswer }));
    };

    const handleSubmit = async () => {
        const formattedAnswers = Object.entries(answers).map(([questionIndex, answer]) => ({
            questionIndex: parseInt(questionIndex),
            answer
        }));

        try {
            await axios.post(API_ENDPOINTS.STUDENT_SUBMIT_TEST, {
                testId: '68580c0e7653da4040e2da53',
                studentId: userId,
                answers: formattedAnswers
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Nộp bài thành công!");
        } catch (err) {
            console.error("Lỗi khi nộp bài:", err);
            alert("Lỗi khi nộp bài kiểm tra!");
        }
    };

    const currentQuestion = QUESTION.find(q => q.id === current);



    return (
        <div style={{ display: "flex", height: "100vh", background: "#fff" }}>
            {/* Left Panel */}
            <div style={{
                width: 260,
                borderRight: "1px solid #eee",
                padding: "32px 0 0 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Thời gian hoàn thành</div>
                <div style={{ color: "#00b200", fontWeight: 700, fontSize: 32, marginBottom: 24 }}>40:01</div>

                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Câu hỏi</div>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 38px)",
                    gap: 8,
                    marginBottom: 16
                }}>
                    {Array.from({ length: TOTAL_QUESTIONS }, (_, i) => {
                        const idx = i + 1;
                        const status = getStatus(idx, current);
                        const { bg, color } = getColorStyle(status);

                        return (
                            <button
                                key={idx}
                                style={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: 8,
                                    border: "none",
                                    background: bg,
                                    color,
                                    fontWeight: 700,
                                    fontSize: 18,
                                    boxShadow: status === "current" ? "0 0 0 2px #222" : undefined,
                                    cursor: "pointer"
                                }}
                                onClick={() => setCurrent(idx)}
                            >
                                {idx}
                            </button>
                        );
                    })}
                </div>

                <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                    <button style={navBtnStyle} onClick={() => handleNav("prev")}>&lt; Lùi</button>
                    <button style={navBtnStyle} onClick={() => handleNav("next")}>Tiếp &gt;</button>
                </div>

                <button
                    onClick={handleSubmit}
                    style={{
                        background: "#4caf50",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: 20,
                        padding: "8px 32px",
                        marginTop: 12,
                        boxShadow: "0 4px 8px #c8e6c9",
                        cursor: "pointer"
                    }}
                >
                    Nộp bài
                </button>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: 24 }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: 700,
                    fontSize: 22,
                    marginBottom: 8
                }}>
                    <span>Tiếng Anh Thiếu nhi 1</span>
                    <span>Điểm: 9 (36/40)</span>
                    <span style={{ fontWeight: 500, fontSize: 18 }}>
                        Thời gian: <span style={{ fontWeight: 700 }}>45p (7h45 - 8h30)</span>
                    </span>
                </div>

                <div style={{
                    border: "2px solid #2196f3",
                    borderRadius: 24,
                    background: "#ededed",
                    height: "calc(100vh - 90px)",
                    marginTop: 8,
                    marginRight: 8,
                    padding: 24
                }}>
                    <h4 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
                        Câu hỏi {current}: {currentQuestion ? currentQuestion.title : "Không có dữ liệu"}
                    </h4>

                    {currentQuestion ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {currentQuestion.options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        padding: "10px 16px",
                                        margin: "8px 0",
                                        background: answers[current] === opt ? "#dbeafe" : "#fff",
                                        border: "1px solid #ccc",
                                        borderRadius: 8
                                    }}
                                    onClick={() => handleAnswer(current, opt)}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p style={{ fontSize: 16, fontStyle: "italic", color: "#666" }}>
                            Không tìm thấy câu hỏi.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const navBtnStyle = {
    background: "#e7ecf7",
    color: "#222",
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 16,
    padding: "6px 18px",
    boxShadow: "0 2px 4px #d1d5db"
};
