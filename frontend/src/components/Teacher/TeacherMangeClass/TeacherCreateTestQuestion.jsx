// frontend/src/components/Teacher/TeacherManageClass/TeacherCreateTestQuestion.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../config';
import '../../../assets/CSS/MinhKhanhCSS.css';
import { Container, Row, Col, Button, Card, Form } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';

const TeacherCreateTestQuestion = () => {
    const { courseId, classId } = useParams();
    const teacherId = localStorage.getItem('userId');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        questions: [
            {
                question: '',
                options: ['', '', '', ''],
                correctAnswerIndex: null
            }
        ]
    });

    const handleQuestionChange = (index, field, value) => {
        const updated = [...formData.questions];
        updated[index][field] = value;
        setFormData({ ...formData, questions: updated });
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const updated = [...formData.questions];
        updated[qIndex].options[optIndex] = value;
        setFormData({ ...formData, questions: updated });
    };

    const setCorrectAnswer = (qIndex, optIndex) => {
        const updated = [...formData.questions];
        updated[qIndex].correctAnswerIndex = optIndex;
        setFormData({ ...formData, questions: updated });
    };

    const removeQuestion = (index) => {
        const updated = [...formData.questions];
        updated.splice(index, 1);
        setFormData({ ...formData, questions: updated });
    };


    const addQuestion = () => {
        setFormData({
            ...formData,
            questions: [
                ...formData.questions,
                {
                    question: '',
                    options: ['', '', '', ''],
                    correctAnswerIndex: null
                }
            ]
        });
    };


    const handleSubmit = async (e) => {
        const token = localStorage.getItem('token');
        e.preventDefault();
        const body = {
            ...formData,
            courseId: '68347991403318cecdab0c12', // hardcoded for now, replace with actual courseId
            classId: '68410ae05062f33e1d4dc448', // hardcoded for now, replace with actual classId
            teacherId: '68322c5de0fc5020f0eac94f',// hardcoded for now, replace with actual teacherId
            questions: formData.questions.map(q => ({
                question: q.question,
                options: q.options,
                correctAnswer: q.options[q.correctAnswerIndex]
            }))
        };


        try {
            const res = await axios.post(API_ENDPOINTS.TEACHER_CREATE_TEST, body, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Test created successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to create test.');
        }
    };

    return (
        <Container className="my-4">
            <Form onSubmit={handleSubmit}>
                <Card className="mb-4 p-3">
                    <Form.Group className="mb-3">
                        <Form.Label>Test Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </Form.Group>
                </Card>

                {formData.questions.map((q, i) => (
                    <Card key={i} className="mb-4 p-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            {formData.questions.length > 1 && (
                                <Button variant="danger" size="sm" onClick={() => removeQuestion(i)}>Remove</Button>
                            )}
                        </div>
                        <Form.Group className="mb-3">
                            <Form.Label>Question {i + 1}</Form.Label>
                            <Form.Control
                                type="text"
                                value={q.question}
                                onChange={(e) => handleQuestionChange(i, 'question', e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Row>
                            {q.options.map((opt, j) => {
                                const isCorrect = q.correctAnswerIndex === j;
                                return (
                                    <Col key={j} md={6} className="mb-3">
                                        <div className={`option-card p-2 d-flex align-items-center justify-content-between border rounded ${isCorrect ? 'border-success bg-light' : ''}`}>
                                            <Form.Control
                                                type="text"
                                                value={opt}
                                                placeholder={`Option ${j + 1}`}
                                                onChange={(e) => handleOptionChange(i, j, e.target.value)}
                                                required
                                            />
                                            <Button
                                                variant={isCorrect ? 'success' : 'outline-secondary'}
                                                className="ms-2"
                                                onClick={() => setCorrectAnswer(i, j)}
                                            >
                                                <FaCheckCircle />
                                            </Button>
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Card>
                ))}

                <div className="mb-3">
                    <Button variant="primary" onClick={addQuestion}>Thêm câu hỏi</Button>
                </div>
                <Button type="submit" variant="success">Tạo đề thi</Button>
            </Form>
        </Container>
    );
};

export default TeacherCreateTestQuestion;
