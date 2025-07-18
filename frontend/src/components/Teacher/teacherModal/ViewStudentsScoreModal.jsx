// frontend/src/components/Teacher/teacherModal/ViewStudentsScoreModal.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import { Modal, Table, Button, Spinner } from "react-bootstrap";

const ViewStudentsScoreModal = ({ show, onClose, testAssignId }) => {
  const [studentSubmissions, setStudentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!testAssignId) return;

    const fetchStudentScores = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          API_ENDPOINTS.GET_SUBMISSIONS_BY_TEST_ASSIGN(testAssignId),
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStudentSubmissions(res.data.data || []);
      } catch (err) {
        console.error("Error fetching student scores:", err);
        setStudentSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentScores();
  }, [testAssignId]);

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>🧑‍🎓 Students' Scores</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center my-3">
            <Spinner animation="border" role="status" />
            <p className="mt-2">Loading student scores...</p>
          </div>
        ) : studentSubmissions.length === 0 ? (
          <p>No student submissions found.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {studentSubmissions.map((s, index) => (
                <tr key={index}>
                  <td>{s.studentName || "N/A"}</td>
                  <td>{s.studentEmail || "N/A"}</td>
                  <td>{s.score != null ? s.score : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewStudentsScoreModal;
