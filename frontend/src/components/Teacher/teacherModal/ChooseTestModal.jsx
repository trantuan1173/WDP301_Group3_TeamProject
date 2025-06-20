// frontend/src/components/Teacher/teacherModal/ChooseTestModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaSearch } from "react-icons/fa";
import "../../../assets/CSS/MinhKhanhCSS.css";
import { API_ENDPOINTS } from '../../../config'
import axios from 'axios';
import CreateTestQuestionModal from "./CreateTestQuestionModal";




const ChooseTestModal = ({ show, onHide, onBack, courseId, classId, onTestSelect }) => {

    const [testBank, setTestBank] = useState([]);
    const [types, setTypes] = useState([]);
    const [levels, setLevels] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [search, setSearch] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedSkill, setSelectedSkill] = useState("");
    //const [selectedTopic, setSelectedTopic] = useState("");
    const [dropdown, setDropdown] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const token = localStorage.getItem("token");

    const filtered = testBank.filter(
        t =>
            t.name.toLowerCase().includes(search.toLowerCase()) &&
            (selectedLevel ? t.level === selectedLevel : true) &&
            (selectedSkill ? t.skill === selectedSkill : true)
        // (selectedTopic ? t.topic === selectedTopic : true)
    );

    useEffect(() => {
        axios.get(API_ENDPOINTS.CREATE_COURSE_DETAIL)
            .then(response => {
                const courses = response.data.data;

                // Extract unique types and levels
                const uniqueTypes = [...new Set(courses.map(item => item.type))];
                const uniqueLevels = [...new Set(courses.map(item => item.level))];

                setTypes(uniqueTypes);
                setLevels(uniqueLevels);
            })
            .catch(error => {
                console.error("Failed to fetch course details:", error);
            });
    }, []);

    useEffect(() => {
        axios.get(API_ENDPOINTS.TEACHER_GET_TESTS, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                const data = res.data.data.map(test => ({
                    id: test._id,
                    name: test.title,
                    questions: test.questions.length,
                    level: "N/A", // you can update this if you have level data
                    date: new Date(test.createdAt).toLocaleDateString()
                }));
                setTestBank(data);
            })
            .catch(err => console.error("Failed to fetch tests", err));
    }, []);


    return (
        <Modal show={show} onHide={onHide} centered dialogClassName="choose-test-modal-at-teacher-choose-test">
            <Modal.Body
                style={{
                    padding: 32,
                    minWidth: 600,
                    height: 576,
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <div className="text-center fw-bold" style={{ fontSize: 32, marginBottom: 18 }}>
                    Chọn bộ đề
                </div>
                <div className="d-flex justify-content-center mb-4">
                    <Form className="d-flex align-items-center" style={{ width: 350 }}>
                        <Form.Control
                            type="text"
                            placeholder="Nhập tên đề"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                borderRadius: 24,
                                background: "#f9f9f9",
                                fontSize: 18,
                                boxShadow: "0 2px 6px #e0e7ef",
                                border: "none",
                                paddingLeft: 20,
                                paddingRight: 40,
                                height: 44
                            }}
                        />
                        <FaSearch style={{ position: "absolute", right: 18, fontSize: 18, color: "#222" }} />
                    </Form>
                </div>
                <div className="d-flex justify-content-between mb-2" style={{ gap: 16 }}>
                    {/* Level Dropdown */}
                    <div style={{ position: "relative", minWidth: 140 }}>
                        <Button
                            style={{
                                background: "#dbeafe",
                                color: "#222",
                                border: "none",
                                borderRadius: 12,
                                fontWeight: 600,
                                fontSize: 18,
                                width: "100%",
                                boxShadow: "0 2px 6px #e0e7ef"
                            }}
                            onClick={() => setDropdown(dropdown === "level" ? "" : "level")}
                        >
                            Loại đề <span style={{ marginLeft: 8 }}>▼</span>
                        </Button>
                        {dropdown === "level" && (
                            <div style={{
                                position: "absolute", top: 48, left: 0, right: 0, background: "#fff",
                                borderRadius: 8, boxShadow: "0 2px 8px #e0e7ef", zIndex: 10
                            }}>
                                {types.map(l => (
                                    <div
                                        key={l}
                                        onClick={() => { setSelectedLevel(l); setDropdown(""); }}
                                        style={{
                                            padding: "8px 16px",
                                            cursor: "pointer",
                                            background: selectedLevel === l ? "#dbeafe" : "#fff"
                                        }}
                                    >
                                        {l}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Skill Dropdown */}
                    <div style={{ position: "relative", minWidth: 140 }}>
                        <Button
                            style={{
                                background: "#dbeafe",
                                color: "#222",
                                border: "none",
                                borderRadius: 12,
                                fontWeight: 600,
                                fontSize: 18,
                                width: "100%",
                                boxShadow: "0 2px 6px #e0e7ef"
                            }}
                            onClick={() => setDropdown(dropdown === "skill" ? "" : "skill")}
                        >
                            Mức độ <span style={{ marginLeft: 8 }}>▼</span>
                        </Button>
                        {dropdown === "skill" && (
                            <div style={{
                                position: "absolute", top: 48, left: 0, right: 0, background: "#fff",
                                borderRadius: 8, boxShadow: "0 2px 8px #e0e7ef", zIndex: 10
                            }}>
                                {levels.map(s => (
                                    <div
                                        key={s}
                                        onClick={() => { setSelectedSkill(s); setDropdown(""); }}
                                        style={{
                                            padding: "8px 16px",
                                            cursor: "pointer",
                                            background: selectedSkill === s ? "#dbeafe" : "#fff"
                                        }}
                                    >
                                        {s}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Create Test Button */}
                    <div style={{ position: "relative", minWidth: 140 }}>
                        <Button
                            style={{
                                background: "#3b82f6",
                                color: "#fff",
                                border: "none",
                                borderRadius: 12,
                                fontWeight: 600,
                                fontSize: 18,
                                width: "100%",
                                height: 44,
                                boxShadow: "0 4px 10px rgba(59,130,246,0.3)",
                                transition: "all 0.2s ease-in-out"
                            }}
                            onClick={() => setShowCreateModal(true)}
                            onMouseOver={(e) => e.currentTarget.style.background = "#2563eb"}
                            onMouseOut={(e) => e.currentTarget.style.background = "#3b82f6"}
                        >
                            Tạo đề <span style={{ marginLeft: 8 }}>＋</span>
                        </Button>




                    </div>
                    {/* Topic Dropdown */}
                    {/* <div style={{ position: "relative", minWidth: 140 }}>
                        <Button
                            style={{
                                background: "#dbeafe",
                                color: "#222",
                                border: "none",
                                borderRadius: 12,
                                fontWeight: 600,
                                fontSize: 18,
                                width: "100%",
                                boxShadow: "0 2px 6px #e0e7ef"
                            }}
                            onClick={() => setDropdown(dropdown === "topic" ? "" : "topic")}
                        >
                            Chủ đề <span style={{ marginLeft: 8 }}>▼</span>
                        </Button>
                        {dropdown === "topic" && (
                            <div style={{
                                position: "absolute", top: 48, left: 0, right: 0, background: "#fff",
                                borderRadius: 8, boxShadow: "0 2px 8px #e0e7ef", zIndex: 10
                            }}>
                                {topics.map(t => (
                                    <div
                                        key={t}
                                        onClick={() => { setSelectedTopic(t); setDropdown(""); }}
                                        style={{
                                            padding: "8px 16px",
                                            cursor: "pointer",
                                            background: selectedTopic === t ? "#dbeafe" : "#fff"
                                        }}
                                    >
                                        {t}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div> */}
                </div>
                {/* Table */}
                <div style={{ marginTop: 16 }}>
                    <table style={{ width: "100%", fontSize: 18 }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid #e0e7ef" }}>
                                <th style={{ width: 60, fontWeight: 600 }}>Chọn</th>
                                <th style={{ fontWeight: 600 }}>Tên</th>
                                <th style={{ fontWeight: 600 }}>Số câu hỏi</th>
                                <th style={{ fontWeight: 600 }}>Mức độ</th>
                                <th style={{ fontWeight: 600 }}>Ngày tạo</th>
                                <th style={{ fontWeight: 600 }}>Xem trước</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(t => (
                                <tr key={t.id} style={{ borderBottom: "1px solid #e0e7ef" }}>
                                    <td>
                                        <Form.Check
                                            type="checkbox"
                                            checked={selectedId === t.id}
                                            onChange={() => setSelectedId(t.id)}
                                        />
                                    </td>
                                    <td className="fw-semibold">{t.name}</td>
                                    <td>{t.questions}</td>
                                    <td>{t.level}</td>
                                    <td>{t.date}</td>
                                    <td></td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
                {/* Footer Buttons */}
                <div className="d-flex justify-content-center" style={{ gap: 32, marginTop: "auto" }}>
                    <Button
                        variant="danger"
                        style={{
                            borderRadius: 16,
                            fontWeight: 600,
                            fontSize: 20,
                            minWidth: 120
                        }}
                        onClick={onBack}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="success"
                        style={{
                            borderRadius: 16,
                            fontWeight: 600,
                            fontSize: 20,
                            minWidth: 120
                        }}
                        onClick={() => {
                            if (selectedId) {
                                onTestSelect(selectedId); // 👈 call parent with selected test ID
                            }
                        }}
                        disabled={!selectedId}
                    >
                        Lưu
                    </Button>

                </div>
            </Modal.Body>
            <CreateTestQuestionModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onSubmit={() => setShowCreateModal(false)}
                courseId={courseId}
                classId={classId}
            />

        </Modal>
    );
};

export default ChooseTestModal;