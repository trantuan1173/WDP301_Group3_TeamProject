// frontend/src/components/Teacher/TeacherMangeClass/TeacherViewScore.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import { Container, Table, Button, Spinner } from "react-bootstrap";
import ViewStudentsScoreModal from "../teacherModal/ViewStudentsScoreModal";

const TeacherViewScore = () => {
  const [assignedTests, setAssignedTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [modalTestAssignId, setModalTestAssignId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAssignedTests = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.GET_ASSIGNED_TESTS_BY_TEACHER, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignedTests(res.data.data || []);
      } catch (err) {
        console.error("Error fetching assigned tests:", err);
        setAssignedTests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedTests();
  }, []);



  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
        <p>Loading assigned tests...</p>
      </div>
    );
  }

  return (
    <>
      <Container className="mt-4">
        <h3 className="mb-4">Tests Assigned</h3>

        {assignedTests.length === 0 ? (
          <p>No tests assigned yet.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>Test Title</th>
                <th>Class</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignedTests.map((test) => (
                <tr key={test._id}>
                  <td>{test.testId?.title || "Untitled"}</td>
                  <td>{test.classId?.className || "Unnamed Class"}</td>
                  <td>
                    <Button
                      onClick={() => {
                        setModalTestAssignId(test._id);
                        setModalShow(true);
                      }}
                    >
                      View Scores
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {selectedTestId && (
          <div className="mt-5">
            <h4>🧑‍🎓 Submissions</h4>
            {submissions.length === 0 ? (
              <p>No student submissions for this test.</p>
            ) : (
              <Table striped bordered hover responsive>
                <thead className="table-light">
                  <tr>
                    <th>Student Email</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s) => (
                    <tr key={s._id}>
                      <td>{s.studentId?.email || s.studentId}</td>
                      <td>{s.score != null ? s.score : "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        )}
      </Container>
      <ViewStudentsScoreModal
        show={modalShow}
        onClose={() => setModalShow(false)}
        testAssignId={modalTestAssignId}
      />

    </>
  );
};

export default TeacherViewScore;
