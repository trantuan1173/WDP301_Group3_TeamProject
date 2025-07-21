// frontend/src/components/Teacher/TeacherMangeClass/TeacherViewScore.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import { Container, Table, Button, Spinner, Pagination } from "react-bootstrap";
import ViewStudentsScoreModal from "../teacherModal/ViewStudentsScoreModal";

const TeacherViewScore = () => {
  const [assignedTests, setAssignedTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [modalTestAssignId, setModalTestAssignId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("newest");
  const [timeRange, setTimeRange] = useState("week");
  const [selectedClass, setSelectedClass] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");


  const itemsPerPage = 10;
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

  const classOptions = [
    ...new Map(
      assignedTests
        .filter((t) => t.classId && t.classId.className)
        .map((t) => [t.classId._id, t.classId])
    ).values(),
  ];

  const filteredAndSortedTests = [...assignedTests]
    .filter((test) => {
      const now = new Date();
      const created = new Date(test.createdAt);
      if (timeRange === "today") return created.toDateString() === now.toDateString();
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
      return true;
    })
    .filter((test) => {
      if (selectedClass === "All") return true;
      return test.classId?._id === selectedClass;
    })
    .filter((test) =>
      test.testId?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );


  const paginatedTests = filteredAndSortedTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAndSortedTests.length / itemsPerPage);

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

        <div className="d-flex flex-wrap align-items-end mb-3">
          <div className="me-3">
            <label className="fw-semibold">Sort:</label>
            <select
              className="form-select"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          <div className="me-3">
            <label className="fw-semibold">Time:</label>
            <select
              className="form-select"
              value={timeRange}
              onChange={(e) => {
                setTimeRange(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div className="me-3">
            <label className="fw-semibold">Class:</label>
            <select
              className="form-select"
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Classes</option>
              {classOptions.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>

          <div className="ms-auto">
            <label className="fw-semibold">Search:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search test title..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>


        {filteredAndSortedTests.length === 0 ? (
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
              {paginatedTests.map((test) => (
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

        {totalPages > 1 && (
          <Pagination className="justify-content-center mt-4">
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            />
            {[...Array(totalPages).keys()].map((num) => {
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
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            />
          </Pagination>
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
