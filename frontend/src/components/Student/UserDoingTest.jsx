// frontend/src/components/Student/UserDoingTest.jsx
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { API_ENDPOINTS } from "../../config";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";


export const UserDoingTest = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(1);
    const [userId, setUserId] = useState(null);
    const [answers, setAnswers] = useState({});
    const { testId } = useParams();
    const [tests, setTests] = useState([]);
    const [questionList, setQuestionList] = useState([]);
    const [timeStr, setTimeStr] = useState("");
    const [remainingTime, setRemainingTime] = useState("");
    const [testAssignId, setTestAssignId] = useState("");



    const getStatus = (index, current) => {
        if (index === current) return "current";
        if (answers[index]) return "answered";
        return "neutral";
    };


    const getColorStyle = (status) => {
        switch (status) {
            case "answered": return { bg: "#4caf50", color: "#fff" }; // green
            case "current": return { bg: "#ff5252", color: "#fff" };
            default: return { bg: "#e0e0e0", color: "#222" };
        }
    };

    // Lấy userId từ token
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

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "Bạn có chắc chắn muốn rời khỏi trang? Bài làm của bạn có thể bị mất.";
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    useEffect(() => {
        if (!userId || !testId) return; // ⬅️ Don’t fetch until userId is available
        const fetchTests = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    API_ENDPOINTS.GET_ASSIGNED_TESTS_FOR_STUDENT(userId, testId),
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setTests(res.data.data);
                setTestAssignId(res.data.data._id);
                setQuestionList(res.data.data.testId.questions);
                console.log("Tests fetched successfully:", res.data.data);

            } catch (error) {
                console.error("Failed to fetch tests:", error);
            }
        };

        fetchTests();
    }, [userId, testId]); // ⬅️ Also include testId


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

    useEffect(() => {
        if (!tests || !tests.startDate || !tests.dueDate) return;

        const start = new Date(tests.startDate);
        const end = new Date(tests.dueDate);

        const durationMs = end - start;
        const durationMin = Math.round(durationMs / 60000);

        const startHour = start.getHours().toString().padStart(2, "0");
        const startMin = start.getMinutes().toString().padStart(2, "0");
        const endHour = end.getHours().toString().padStart(2, "0");
        const endMin = end.getMinutes().toString().padStart(2, "0");

        setTimeStr(`${durationMin}p (${startHour}h${startMin} - ${endHour}h${endMin})`);
    }, [tests]);

    useEffect(() => {
        if (!tests || !tests.startDate || !tests.dueDate) return;

        const interval = setInterval(() => {
            const now = new Date();
            const end = new Date(tests.dueDate);
            const diffMs = end - now;

            if (diffMs <= 0) {
                setRemainingTime("00:00");
                clearInterval(interval);
                return;
            }

            const totalSec = Math.floor(diffMs / 1000);
            const min = Math.floor(totalSec / 60).toString().padStart(2, "0");
            const sec = (totalSec % 60).toString().padStart(2, "0");

            setRemainingTime(`${min}:${sec}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [tests]);


    const handleSubmit = async () => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn nộp bài? Sau khi nộp bạn sẽ không thể sửa đổi.");
        if (!confirmed) return;
        const formattedAnswers = Object.entries(answers).map(([questionIndex, answer]) => ({
            questionIndex: parseInt(questionIndex),
            answer
        }));

        try {
            await axios.post(API_ENDPOINTS.STUDENT_SUBMIT_TEST, {
                testAssignId: testAssignId,
                studentId: userId,
                answers: formattedAnswers
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Nộp bài thành công!");
            navigate(`/user`);
        } catch (err) {
            console.error("Lỗi khi nộp bài:", err);
            alert("Lỗi khi nộp bài kiểm tra!");
        }
    };

    useEffect(() => {
        if (remainingTime === "00:00") {
            // Only auto-submit if the test has loaded (testAssignId exists)
            if (testAssignId) {
                handleSubmit();
            }
        }
    }, [remainingTime, testAssignId, questionList]);


    const currentQuestion = questionList[current - 1];
    const TOTAL_QUESTIONS = questionList.length || 0;



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
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Thời gian còn lại</div>
                <div style={{ color: "#00b200", fontWeight: 700, fontSize: 32, marginBottom: 24 }}>
                    {remainingTime || "00:00"}
                </div>


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
                    <span style={{ fontWeight: 500, fontSize: 18 }}>
                        Thời gian: <span style={{ fontWeight: 700 }}>{timeStr || "..."}</span>
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
                        Câu hỏi {current}: {currentQuestion ? currentQuestion.question : "Không có dữ liệu"}
                    </h4>

                    {currentQuestion ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {currentQuestion.options.map((opt, idx) => (
                                <label key={idx} style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "8px 12px",
                                    margin: "6px 0",
                                    background: "#fff",
                                    border: "1px solid #ccc",
                                    borderRadius: 8,
                                    cursor: "pointer"
                                }}>
                                    <input
                                        type="radio"
                                        name={`question-${current}`}
                                        value={opt}
                                        checked={answers[current] === opt}
                                        onChange={() => handleAnswer(current, opt)}
                                        style={{ marginRight: 12 }}
                                    />
                                    {opt}
                                </label>
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
