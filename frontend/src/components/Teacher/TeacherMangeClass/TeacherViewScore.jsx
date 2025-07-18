// frontend/src/components/Teacher/TeacherMangeClass/TeacherViewScore.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import { Container, Table, Button, Spinner } from "react-bootstrap";
import ViewStudentsScoreModal from "../teacherModal/ViewStudentsScoreModal";
import { Pagination } from "react-bootstrap";


const TeacherViewScore = () => {
  const [assignedTests, setAssignedTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [modalTestAssignId, setModalTestAssignId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortOrder, setSortOrder] = useState("newest");
  const [timeRange, setTimeRange] = useState("today");


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
        <h3 className="mb-3">Tests Assigned</h3>
        <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
          <div>
            <label className="me-2 fw-semibold">Sort:</label>
            <select
              className="form-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          <div>
            <label className="me-2 fw-semibold">Time:</label>
            <select
              className="form-select"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

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
              {[...assignedTests]
                .filter((test) => {
                  const now = new Date();
                  const created = new Date(test.createdAt);

                  if (timeRange === "today") {
                    return created.toDateString() === now.toDateString();
                  }
                  if (timeRange === "week") {
                    const weekAgo = new Date();
                    weekAgo.setDate(now.getDate() - 7);
                    return created >= weekAgo;
                  }
                  if (timeRange === "month") {
                    const monthAgo = new Date();
                    monthAgo.setMonth(now.getMonth() - 1);
                    return created >= monthAgo;
                  }
                  return true; // all
                })
                .sort((a, b) => {
                  return sortOrder === "newest"
                    ? new Date(b.createdAt) - new Date(a.createdAt)
                    : new Date(a.createdAt) - new Date(b.createdAt);
                })
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((test) => (
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
        <Pagination className="justify-content-center mt-4">
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          />

          {[...Array(Math.ceil(assignedTests.length / itemsPerPage)).keys()].map((num) => {
            const page = num + 1;
            return (
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Pagination.Item>
            );
          })}

          <Pagination.Next
            disabled={currentPage === Math.ceil(assignedTests.length / itemsPerPage)}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          />
        </Pagination>


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
