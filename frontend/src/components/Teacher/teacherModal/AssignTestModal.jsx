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
    selectedTest,
}) => {
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState(new Date()); // default: now
    const [testDuration, setTestDuration] = useState(60); // default: 60 minutes

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

    // When selectedTest changes, update description
    React.useEffect(() => {
        if (selectedTest && selectedTest.description) {
            setDescription(selectedTest.description);
        }
    }, [selectedTest]);

    const handleExcelFileChange = (e) => {
        setExcelFile(e.target.files[0]);
    };
    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            let assignTestId = null;
            const dueDate = new Date(startTime.getTime() + testDuration * 60000);

            if (startTime < new Date()) {
                alert("⚠️ Thời gian bắt đầu không được ở quá khứ.");
                return;
            }

            if (testDuration <= 5) {
                alert("⚠️ Thời gian bài kiểm tra phải lớn hơn 5 phút.");
                return;
            }

            if (excelFile) {
                // Upload file and get new testId
                const formData = new FormData();
                formData.append("file", excelFile);
                formData.append("title", title);
                formData.append("description", description);
                formData.append("courseId", courseId);
                formData.append("teacherId", teacherId);
                formData.append("startDate", startTime.toISOString());
                formData.append("dueDate", dueDate.toISOString());


                const res = await axios.post(API_ENDPOINTS.UPLOAD_TEST_FROM_XLSX, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                assignTestId = res.data.data._id;
            } else if (testId) {
                // Use selected testId from bank
                assignTestId = testId;
            } else {
                // Validate manual questions (if you support this)
                const isValid = questions.every(q =>
                    q.question.trim() !== "" &&
                    q.options.every(opt => opt.trim() !== "")
                );
                if (!isValid) {
                    alert("⚠️ Vui lòng điền đầy đủ nội dung câu hỏi và các lựa chọn.");
                    return;
                }
                // You may want to handle manual test creation here
                alert("Vui lòng chọn đề hoặc tải đề lên.");
                return;
            }



            // Assign the test if we have a testId
            if (assignTestId) {
                await axios.post(API_ENDPOINTS.TEACHER_ASSIGN_TEST, {
                    courseId,
                    testId: assignTestId,
                    classId,
                    title,
                    teacherId,
                    startDate: startTime.toISOString(),
                    dueDate: new Date(startTime.getTime() + testDuration * 60000).toISOString(),

                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
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

    function formatDateTimeLocal(date) {
        const pad = (n) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }


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
                            required={true}
                        />
                    </Form.Group>
                    <div className="d-flex" style={{ gap: 24, marginBottom: 16 }}>
                        <Form.Group className="mb-0" style={{ flex: 1 }}>
                            <Form.Label className="fw-semibold" style={{ fontSize: 16 }}>
                                Thời gian bắt đầu
                            </Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={formatDateTimeLocal(startTime)}
                                onChange={(e) => setStartTime(new Date(e.target.value))}
                                style={{
                                    borderRadius: 12,
                                    background: "#eaf3ff",
                                    fontSize: 18,
                                    minHeight: 48,
                                    marginTop: 4,
                                    width: "100%"
                                }}
                                required={true}
                            />
                        </Form.Group>

                        <Form.Group className="mb-0" style={{ flex: 1 }}>
                            <Form.Label className="fw-semibold" style={{ fontSize: 16 }}>
                                Thời lượng bài kiểm tra (phút)
                            </Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                value={testDuration}
                                onChange={(e) => setTestDuration(e.target.value)}
                                style={{
                                    borderRadius: 12,
                                    background: "#eaf3ff",
                                    fontSize: 18,
                                    minHeight: 48,
                                    marginTop: 4,
                                    width: "100%"
                                }}
                            />
                        </Form.Group>

                    </div>
                    <div style={{ marginBottom: 16, fontSize: 18, fontWeight: 500 }}>
                        Thời gian kết thúc:{" "}
                        {new Date(startTime.getTime() + testDuration * 60000).toLocaleString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                        })}
                    </div>



                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold" style={{ fontSize: 16 }}>Đề được chọn</Form.Label>
                        {selectedTest ? (
                            <div
                                style={{
                                    borderRadius: 16,
                                    background: "#eaf3ff",
                                    boxShadow: "0 3px 6px #e0e7ef",
                                    fontSize: 18,
                                    minHeight: 48,
                                    marginTop: 4,
                                    height: 73,
                                    width: 646,
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "0 20px",
                                    gap: 32,
                                    fontWeight: 500
                                }}
                            >
                                <span><b>Tên:</b> {selectedTest.name}</span>
                                <span><b>Số câu hỏi:</b> {selectedTest.questions}</span>
                                {/* <span><b>Mức độ:</b> {selectedTest.level}</span> */}
                                <span><b>Ngày tạo:</b> {selectedTest.date}</span>
                            </div>
                        ) : (
                            <div
                                style={{
                                    borderRadius: 16,
                                    background: "#eaf3ff",
                                    boxShadow: "0 3px 6px #e0e7ef",
                                    fontSize: 18,
                                    minHeight: 48,
                                    marginTop: 4,
                                    height: 73,
                                    width: 646,
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "0 20px",
                                    color: "#888"
                                }}
                            >
                                Chưa chọn đề nào
                            </div>
                        )}
                    </Form.Group>
                    <div className="mb-3 d-flex" style={{ gap: 12 }}>
                        {/* Upload Section */}
                        <div className="w-50 position-relative">
                            <Form.Control
                                type="text"
                                value={excelFile ? excelFile.name : ""}
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
                                onChange={e => setExcelFile(e.target.files[0])}
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
                    // disabled={!title}
                    >
                        Giao
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default AssignTestModal;