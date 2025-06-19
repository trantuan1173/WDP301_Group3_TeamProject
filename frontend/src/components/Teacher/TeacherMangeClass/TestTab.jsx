// frontend/src/components/Teacher/TeacherMangeClass/TestTab.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import { Col, Row, Button, Card, Container, Table, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faEdit, faTrash, faPlus, faFileExport, faSearch } from "@fortawesome/free-solid-svg-icons";
import "../../../assets/CSS/MinhKhanhCSS.css"
import ChooseTestModal from "../teacherModal/ChooseTestModal";
import AssignTestModal from "../teacherModal/AssignTestModal";

const testData = [
    {
        id: 1,
        name: "Kiểm tra 1",
        time: "45p (7h45 - 8h30)",
        description: "Kiểm tra kiến thức đầu vào"
    },
    {
        id: 2,
        name: "Kiểm tra 2",
        time: "45p (7h45 - 8h30)",
        description: "Kiểm tra kiến thức đầu vào"
    }
];


const TestTab = ({ classId, courseId }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showChooseModal, setShowChooseModal] = useState(false);

    const [testData, setTestData] = useState([]);


    return (
        <div className="h-screen flex flex-col">
            <div className="flex-1 p-4">
                {/* Body */}
                <Row>
                    <Col>
                        <div style={{ background: "#f5f9fc", minHeight: "100vh", padding: "32px" }}>
                            <Container fluid>
                                <h2 className="fw-bold mb-4" style={{ color: "#111827", paddingBottom: "30px", marginLeft: "30px" }}>Bài Kiểm Tra</h2>
                                <Row className="mb-4" style={{ gap: "26px", alignItems: "center", justifyContent: "center" }}>
                                    <Col md={3}>
                                        <Form.Select
                                            className="py-2 fw-semibold"
                                            style={{
                                                background: "#0a2540",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "12px",
                                                boxShadow: "0 2px 6px #e0e7ef",
                                                height: "53px",
                                                width: "293px"
                                            }}
                                        >
                                            <option>Tiếng Anh Thiếu nhi 1</option>
                                        </Form.Select>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Select
                                            className="py-2 fw-semibold"
                                            style={{
                                                background: "#0a2540",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "12px",
                                                boxShadow: "0 2px 6px #e0e7ef",
                                                height: "53px",
                                                width: "293px"
                                            }}
                                        >
                                            <option>Lớp A01 - 1</option>
                                        </Form.Select>
                                    </Col>
                                </Row>
                                <Card className="p-4" style={{ background: "#f5f9fc", border: "none", borderRadius: "18px" }}>
                                    <div className="d-flex align-items-center mb-2">
                                        <span className="fw-bold fs-5 me-4" style={{ color: "#111827" }}>Danh sách</span>
                                        <div style={{ borderBottom: "2px solid #e0e7ef", flex: 1, marginBottom: "-12px" }} />
                                        <Form className="d-flex align-items-center ms-4" style={{ flex: 1, maxWidth: 400 }}>
                                            <Form.Control
                                                type="text"
                                                placeholder=""
                                                className="rounded-pill me-2"
                                                style={{
                                                    background: "#fff",
                                                    border: "1px solid #e0e7ef",
                                                    boxShadow: "0 2px 6px #e0e7ef"
                                                }}
                                            />
                                            <Button variant="light" className="rounded-circle border-0" style={{ boxShadow: "none" }}>
                                                <FontAwesomeIcon icon={faSearch} />
                                            </Button>
                                        </Form>
                                        <Button
                                            className="fw-bold ms-4"
                                            style={{
                                                background: "#DFE9FF",
                                                color: "#111827",
                                                border: "none",
                                                borderRadius: "12px",
                                                boxShadow: "0 2px 6px #e0e7ef",
                                                minWidth: 150,
                                                fontWeight: 600
                                            }}
                                            onClick={() => setShowCreateModal(true)}
                                        >
                                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                                            Tạo mới
                                        </Button>
                                    </div>
                                    <div className="d-flex align-items-center mb-3 mt-3">
                                        <Button
                                            variant="light"
                                            className="me-3 fw-semibold d-flex align-items-center"
                                            style={{
                                                background: "#DFE9FF",
                                                border: "none",
                                                borderRadius: "10px",
                                                boxShadow: "0 2px 6px #DFE9FF",
                                                minWidth: 120,
                                                fontWeight: 600
                                            }}
                                        >
                                            Thời gian
                                            <span style={{ marginLeft: 8, fontSize: 12 }}>
                                                <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </span>
                                        </Button>
                                        <Button
                                            variant="light"
                                            className="fw-semibold d-flex align-items-center"
                                            style={{
                                                background: "#DFE9FF",
                                                border: "none",
                                                borderRadius: "10px",
                                                boxShadow: "0 2px 6px #DFE9FF",
                                                minWidth: 120,
                                                fontWeight: 600
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faFileExport} className="me-2" />
                                            Xuất dữ liệu
                                        </Button>
                                    </div>
                                    <Table hover className="align-middle" style={{ background: "#f5f9fc" }}>
                                        <thead>
                                            <tr style={{ borderBottom: "2px solid #e0e7ef" }}>
                                                <th style={{ width: 60, color: "#111827" }}>STT</th>
                                                <th style={{ color: "#111827" }}>Tên</th>
                                                <th style={{ color: "#111827" }}>Thời gian</th>
                                                <th style={{ color: "#111827" }}>Mô tả</th>
                                                <th style={{ width: 120, color: "#111827" }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {testData.map((test, idx) => (
                                                <tr key={test.id} style={{ borderBottom: "1px solid #e0e7ef" }}>
                                                    <td>{idx + 1}</td>
                                                    <td className="fw-semibold">{test.name}</td>
                                                    <td className="fw-bold">{test.time}</td>
                                                    <td>{test.description}</td>
                                                    <td>
                                                        <Button variant="link" className="p-1 me-2 text-dark">
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </Button>
                                                        <Button variant="link" className="p-1 text-dark">
                                                            <FontAwesomeIcon icon={faFileExport} />
                                                        </Button>
                                                        <Button variant="link" className="p-1 text-dark">
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card>
                            </Container>
                        </div>
                    </Col>
                </Row>

                <AssignTestModal
                    show={showCreateModal}
                    onHide={() => setShowCreateModal(false)}
                    onSubmit={() => setShowCreateModal(false)}
                    switchToChooseModal={() => {
                        setShowCreateModal(false);
                        setShowChooseModal(true);
                    }}
                />
                <ChooseTestModal
                    show={showChooseModal}
                    onHide={() => setShowChooseModal(false)}
                    onBack={() => {
                        setShowChooseModal(false);
                        setShowCreateModal(true);
                    }}
                    courseId={courseId}   // <-- add this line
                    classId={classId}     // <-- add this line
                />


            </div>
        </div>
    );
}

export default TestTab;