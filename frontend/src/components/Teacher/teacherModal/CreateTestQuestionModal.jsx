// frontend/src/components/Teacher/teacherModal/CreateTestQuestionModal.jsx
import React, { useState } from "react";
import { Modal, Button, Form, Card } from "react-bootstrap";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import { jwtDecode } from "jwt-decode";

const CreateTestQuestionModal = ({ show, onHide, onSubmit, courseId, classId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswerIndex: 0 }
  ]);

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
      const decodedToken = jwtDecode(token);
      const teacherId = decodedToken.id;
      const payload = {
        title,
        description,
        courseId: courseId,  
        classId: classId,
        teacherId: teacherId,
        questions: questions.map((q) => ({
          ...q,
          correctAnswer: q.options[q.correctAnswerIndex]
        }))
      };
      console.log("Payload being sent:", payload);

      await axios.post(API_ENDPOINTS.TEACHER_CREATE_TEST, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      onSubmit?.();
      onHide();
    } catch (err) {
      
      console.error("Create test failed:", err);
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

          {questions.map((q, qIdx) => (
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

          <Button variant="secondary" onClick={handleAddQuestion}>
            + Thêm câu hỏi
          </Button>
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
