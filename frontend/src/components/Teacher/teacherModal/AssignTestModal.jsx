// frontend/src/components/Teacher/teacherModal/AssignTestModal.jsx
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaUpload } from "react-icons/fa";
import "../../../assets/CSS/MinhKhanhCSS.css"
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";


const AssignTestModal = ({
    show,
    onHide,
    onSubmit,
    switchToChooseModal,
    courseId,
    classId,
    teacherId,
    testId,
}) => {
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [dueDate, setDueDate] = useState(new Date());
    const [startHour, setStartHour] = useState('07');
    const [startMinute, setStartMinute] = useState('45');
    const [startPeriod, setStartPeriod] = useState('AM');
    const [endHour, setEndHour] = useState('09');
    const [endMinute, setEndMinute] = useState('00');
    const [endPeriod, setEndPeriod] = useState('AM');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [excelFile, setExcelFile] = useState(null);
    const [questions, setQuestions] = useState([
        { question: "", options: ["", "", "", ""], correctAnswerIndex: 0 }
    ]);

    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    const handleDownloadTemplate = () => {
        axios.get(API_ENDPOINTS.DOWNLOAD_XLSX_TEMPLATE, {
            responseType: 'blob',
        })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'test-template.xlsx');
                document.body.appendChild(link);
                link.click();
            })
            .catch((error) => {
                console.error('Error downloading template:', error);
            });
    };


    const handleExcelFileChange = (e) => {
        setExcelFile(e.target.files[0]);
    };
    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");

            let createdTestId = null;

            if (excelFile) {
                const formData = new FormData();
                formData.append("file", excelFile);
                formData.append("title", title);
                formData.append("description", description);
                formData.append("courseId", courseId);
                formData.append("teacherId", teacherId);

                const res = await axios.post(API_ENDPOINTS.UPLOAD_TEST_FROM_XLSX, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                createdTestId = res.data.data._id;
                console.log("Assigning testId:", createdTestId, "to classId:", classId);
                console.log("Effective courseId for assignment:", courseId);
            } else {
                const isValid = questions.every(q =>
                    q.question.trim() !== "" &&
                    q.options.every(opt => opt.trim() !== "")
                );
                if (!isValid) {
                    alert("⚠️ Vui lòng điền đầy đủ nội dung câu hỏi và các lựa chọn.");
                    return;
                }
            }
            
            // Giao bài
            if (createdTestId) {
                console.log("Calling assign API with:", {
                    courseId,
                    testId: createdTestId,
                    classId,
                    title,
                    teacherId,
                    startDate: startDate.toISOString(),
                    dueDate: dueDate.toISOString()
                });
                await axios.post(API_ENDPOINTS.TEACHER_ASSIGN_TEST, {
                    courseId,
                    testId: createdTestId,
                    classId,
                    title,
                    teacherId,
                    startDate: startDate.toISOString(),
                    dueDate: dueDate.toISOString()
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("✅ Assigned test successfully");
            }

            // Reset
            setTitle("");
            setDescription("");
            setQuestions([{ question: "", options: ["", "", "", ""], correctAnswerIndex: 0 }]);
            setExcelFile(null);

            onSubmit?.();
            onHide();
        } catch (err) {
            console.error("❌ Giao bài kiểm tra thất bại:", err);
            alert("Đã xảy ra lỗi khi giao bài kiểm tra.");
        }
    };
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            dialogClassName="create-test-modal-at-teacher-create-test"
        >
            <Modal.Body style={{ height: '75vh', width: '100%', overflowY: 'auto', padding: 32 }}>
                <div className="text-center fw-bold" style={{ fontSize: 28, marginBottom: 24 }}>
                    Giao bài kiểm tra
                </div>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold" style={{ fontSize: 16 }}>Tên</Form.Label>
                        <Form.Control
                            style={{
                                borderRadius: 16,
                                background: "#eaf3ff",
                                boxShadow: "0 3px 6px #e0e7ef",
                                fontSize: 20,
                                minHeight: 48,
                                marginTop: 4
                            }}
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold" style={{ fontSize: 16 }}>Thời gian</Form.Label>
                        <div className="d-flex align-items-center justify-content-between" style={{ gap: 12 }}>
                            <span style={{ color: "#7c7c7c", fontSize: 14, marginRight: 8 }}>{today}</span>
                            {/* Start Time */}
                            <input
                                type="text"
                                maxLength={2}
                                value={startHour}
                                onChange={e => setStartHour(e.target.value.replace(/\D/, '').slice(0, 2))}
                                style={{
                                    width: 56, fontSize: 36, textAlign: "center", background: "#edeaff", border: "none", borderRadius: 8, marginRight: 4
                                }}
                            />
                            <span style={{ fontSize: 36, fontWeight: 600, marginRight: 4 }}>:</span>
                            <input
                                type="text"
                                maxLength={2}
                                value={startMinute}
                                onChange={e => setStartMinute(e.target.value.replace(/\D/, '').slice(0, 2))}
                                style={{
                                    width: 56, fontSize: 36, textAlign: "center", background: "#edeaff", border: "none", borderRadius: 8, marginRight: 4
                                }}
                            />
                            <div className="d-flex flex-column align-items-center" style={{ marginRight: 12 }}>
                                <Button
                                    size="sm"
                                    variant={startPeriod === "AM" ? "secondary" : "outline-secondary"}
                                    style={{ borderRadius: 8, marginBottom: 2, fontSize: 12, padding: "2px 8px" }}
                                    onClick={() => setStartPeriod("AM")}
                                >AM</Button>
                                <Button
                                    size="sm"
                                    variant={startPeriod === "PM" ? "secondary" : "outline-secondary"}
                                    style={{ borderRadius: 8, fontSize: 12, padding: "2px 8px" }}
                                    onClick={() => setStartPeriod("PM")}
                                >PM</Button>
                            </div>
                            {/* End Time */}
                            <input
                                type="text"
                                maxLength={2}
                                value={endHour}
                                onChange={e => setEndHour(e.target.value.replace(/\D/, '').slice(0, 2))}
                                style={{
                                    width: 56, fontSize: 36, textAlign: "center", background: "#edeaff", border: "none", borderRadius: 8, marginRight: 4
                                }}
                            />
                            <span style={{ fontSize: 36, fontWeight: 600, marginRight: 4 }}>:</span>
                            <input
                                type="text"
                                maxLength={2}
                                value={endMinute}
                                onChange={e => setEndMinute(e.target.value.replace(/\D/, '').slice(0, 2))}
                                style={{
                                    width: 56, fontSize: 36, textAlign: "center", background: "#edeaff", border: "none", borderRadius: 8, marginRight: 4
                                }}
                            />
                            <div className="d-flex flex-column align-items-center">
                                <Button
                                    size="sm"
                                    variant={endPeriod === "AM" ? "secondary" : "outline-secondary"}
                                    style={{ borderRadius: 8, marginBottom: 2, fontSize: 12, padding: "2px 8px" }}
                                    onClick={() => setEndPeriod("AM")}
                                >AM</Button>
                                <Button
                                    size="sm"
                                    variant={endPeriod === "PM" ? "secondary" : "outline-secondary"}
                                    style={{ borderRadius: 8, fontSize: 12, padding: "2px 8px" }}
                                    onClick={() => setEndPeriod("PM")}
                                >PM</Button>
                            </div>
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold" style={{ fontSize: 16 }}>Mô tả</Form.Label>
                        <Form.Control
                            as="textarea"
                            style={{
                                borderRadius: 16,
                                background: "#eaf3ff",
                                boxShadow: "0 3px 6px #e0e7ef",
                                fontSize: 20,
                                minHeight: 48,
                                marginTop: 4,
                                height: 73,
                                width: 646
                            }}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </Form.Group>
                    <div className="mb-3 d-flex" style={{ gap: 12 }}>
                        {/* Upload Section */}
                        <div className="w-50 position-relative">
                            <Form.Control
                                type="text"
                                value={file ? file.name : ""}
                                placeholder="Tải đề lên từ thiết bị"
                                style={{
                                    borderRadius: 12,
                                    background: "#e0e0e0",
                                    fontSize: 18,
                                    paddingRight: 48,
                                    boxShadow: "0 2px 6px #e0e7ef",
                                    height: 74,
                                    width: "100%",
                                }}
                                disabled
                            />
                            <input
                                type="file"
                                accept=".xlsx"
                                style={{
                                    position: "absolute",
                                    top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer"
                                }}
                                onChange={handleExcelFileChange}
                            />
                            <FaUpload style={{
                                position: "absolute",
                                right: 16,
                                top: "50%",
                                transform: "translateY(-50%)",
                                fontSize: 28,
                                color: "#222"
                            }} />
                        </div>

                        {/* Download Section */}
                        <div className="w-50 d-flex align-items-center justify-content-center"
                            style={{
                                borderRadius: 12,
                                background: "#e0e0e0",
                                height: 74,
                                boxShadow: "0 2px 6px #e0e7ef",
                                cursor: "pointer"
                            }}
                            onClick={handleDownloadTemplate}
                        >
                            <FontAwesomeIcon icon={faDownload} style={{ fontSize: 28, color: "#222" }} />
                            <span style={{ marginLeft: 12, fontSize: 16, fontWeight: 600 }}>Tải file mẫu</span>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center mb-3">
                        <Button
                            style={{
                                background: "#7ec3f7",
                                color: "#00529b",
                                border: "none",
                                borderRadius: 12,
                                fontWeight: 600,
                                fontSize: 20,
                                boxShadow: "0 2px 6px #e0e7ef",
                                maxWidth: 382,
                                width: 382,
                                height: 74,
                            }}
                            onClick={switchToChooseModal}
                        >
                            Chọn đề từ ngân hàng câu hỏi
                        </Button>
                    </div>
                </Form>
                <div className="d-flex justify-content-end mt-3" style={{ gap: 16 }}>
                    <Button
                        variant="danger"
                        style={{
                            borderRadius: 16,
                            fontWeight: 600,
                            fontSize: 20,
                            minWidth: 100
                        }}
                        onClick={onHide}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="success"
                        style={{
                            borderRadius: 16,
                            fontWeight: 600,
                            fontSize: 20,
                            minWidth: 100
                        }}
                        onClick={handleSubmit}
                        disabled={!title || !description}
                    >
                        Lưu
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default AssignTestModal;