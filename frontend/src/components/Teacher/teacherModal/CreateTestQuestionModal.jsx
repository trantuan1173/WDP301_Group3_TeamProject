import React, { useState } from "react";
import { Modal, Button, Form, Card } from "react-bootstrap";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import { jwtDecode } from "jwt-decode";

const CreateTestQuestionModal = ({ show, onHide, onSubmit, courseId, classId, userId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswerIndex: 0 }
  ]);
  const [excelFile, setExcelFile] = useState(null);

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx, optIdx, value) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIdx, index) => {
    const updated = [...questions];
    updated[qIdx].correctAnswerIndex = index;
    setQuestions(updated);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswerIndex: 0 }]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length > 1) {
      const updated = [...questions];
      updated.splice(index, 1);
      setQuestions(updated);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const teacherId = userId;

      if (excelFile) {
        const formData = new FormData();
        formData.append("file", excelFile);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("courseId", courseId);
        // formData.append("classId", classId);
        formData.append("teacherId", teacherId);

        await axios.post(API_ENDPOINTS.UPLOAD_TEST_FROM_XLSX, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        const isValid = questions.every(q =>
          q.question.trim() !== "" &&
          q.options.every(opt => opt.trim() !== "")
        );
        if (!isValid) {
          alert("⚠️ Vui lòng điền đầy đủ nội dung câu hỏi và các lựa chọn.");
          return;
        }

        const payload = {
          title,
          description,
          courseId,
          // classId,
          teacherId,
          questions: questions.map((q) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.options[q.correctAnswerIndex]
          }))
        };

        await axios.post(API_ENDPOINTS.TEACHER_CREATE_TEST, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setTitle("");
      setDescription("");
      setQuestions([{ question: "", options: ["", "", "", ""], correctAnswerIndex: 0 }]);
      setExcelFile(null);

      onSubmit?.();
      onHide();
    } catch (err) {
      console.error("❌ Create test failed:", err);
      alert("Đã xảy ra lỗi khi tạo đề kiểm tra.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Tạo đề kiểm tra</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "70vh" }}>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Tiêu đề</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          {/* Upload file Excel */}
          <Form.Group className="mb-4">
            <Form.Label>Tải đề từ file Excel (.xlsx)</Form.Label>
            <Form.Control
              type="file"
              accept=".xlsx"
              onChange={(e) => setExcelFile(e.target.files[0])}
            />
          </Form.Group>

          {/* Chỉ hiện khối tạo thủ công nếu chưa chọn file Excel */}
          {!excelFile && questions.map((q, qIdx) => (
            <Card className="mb-3" key={qIdx}>
              <Card.Body>
                <Form.Group className="mb-2">
                  <Form.Label>Câu hỏi {qIdx + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(qIdx, e.target.value)}
                  />
                </Form.Group>
                {q.options.map((opt, optIdx) => (
                  <Form.Group key={optIdx} className="mb-2">
                    <Form.Check
                      type="radio"
                      label={
                        <Form.Control
                          type="text"
                          value={opt}
                          style={{
                            backgroundColor: q.correctAnswerIndex === optIdx ? "#e0ffe0" : "white"
                          }}
                          onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                        />
                      }
                      checked={q.correctAnswerIndex === optIdx}
                      onChange={() => handleCorrectAnswerChange(qIdx, optIdx)}
                      name={`correct-${qIdx}`}
                    />
                  </Form.Group>
                ))}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveQuestion(qIdx)}
                  disabled={questions.length === 1}
                >
                  Xóa câu hỏi
                </Button>
              </Card.Body>
            </Card>
          ))}

          {!excelFile && (
            <Button variant="secondary" onClick={handleAddQuestion}>
              + Thêm câu hỏi
            </Button>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button variant="success" onClick={handleSubmit} disabled={!title || !description}>
          Tạo đề
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateTestQuestionModal;